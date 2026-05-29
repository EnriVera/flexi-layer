/**
 * flexi-modal - Web Component para modales con patrón EventBus
 *
 * El componente <flexi-modal> se suscribe al EventBus y maneja el stack internamente
 * como el patrón Vue 2 original.
 */

// ============================================
// Tipos
// ============================================

export interface FlexiEntry {
  target: string;      // Nombre del modal (ej: 'auth-modal', 'confirm-modal')
  component: string;  // Componente a renderizar (ej: 'LoginForm', 'UserProfile')
  params?: Record<string, unknown>; // Parámetros para el componente
}

// Re-export FlexiEntry from infra (new API - without target)
export type { FlexiEntry as FlexiEntryNew } from './infra/flexi-bus.js';

// Re-export FlexiBus
export { FlexiBus, flexiBus } from './infra/flexi-bus.js';

// Re-export FlexiComponent
export { FlexiComponent } from './components/flexi-component.js';

export interface FlexiModalOptions {
  clickFuera?: boolean;  // Cerrar al hacer click en el overlay
  closeOnEscape?: boolean; // Cerrar con Escape
  size?: 'sm' | 'md' | 'lg' | 'full';
}

// ============================================
// EventBus (singleton, accesible desde cualquier framework)
// ============================================

type SuscriptorCallback = (data: unknown) => void;

class FlexiEventBusClass {
  private suscriptores: Map<string, SuscriptorCallback[]> = new Map();

  /**
   * Suscribirse a un evento
   * @param mensaje - Nombre del evento ('flexi:open', 'flexi:push', 'flexi:close')
   * @param callback - Función a ejecutar cuando ocurra el evento
   */
  subscribe(mensaje: string, callback: SuscriptorCallback): void {
    const callbacks = this.suscriptores.get(mensaje) || [];
    callbacks.push(callback);
    this.suscriptores.set(mensaje, callbacks);
  }

  /**
   * Desuscribirse de un evento
   * @param mensaje - Nombre del evento
   * @param callback - Callback a remover
   */
  unsubscribe(mensaje: string, callback: SuscriptorCallback): void {
    const callbacks = this.suscriptores.get(mensaje);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Enviar un evento a todos los suscriptores
   * @param mensaje - Nombre del evento
   * @param data - Datos a enviar
   */
  send(mensaje: string, data?: unknown): void {
    const callbacks = this.suscriptores.get(mensaje);
    if (!callbacks) return;

    callbacks.forEach(callback => callback(data));
  }

  /**
   * Verificar si hay suscriptores para un evento
   */
  haySuscriptores(mensaje: string): boolean {
    const callbacks = this.suscriptores.get(mensaje);
    return callbacks ? callbacks.length > 0 : false;
  }
}

// Singleton del EventBus
export const FlexiEventBus = new FlexiEventBusClass();

// Funciones helper para usar desde cualquier framework
export function flexiOpen(entry: FlexiEntry): void {
  FlexiEventBus.send('flexi:open', entry);
}

export function flexiPush(entry: FlexiEntry): void {
  FlexiEventBus.send('flexi:push', entry);
}

export function flexiClose(target?: string): void {
  FlexiEventBus.send('flexi:close', { target });
}

export function flexiCloseAll(target: string): void {
  FlexiEventBus.send('flexi:closeAll', { target });
}

// Alias para compatibilidad
export const flexiCloseAllModal = flexiCloseAll;

// ============================================
// Web Component
// ============================================

import { LitElement, html, type TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface ComponenteEnStack {
  id: string;
  component: string;
  params?: Record<string, unknown>;
}

@customElement('flexi-modal')
export class FlexiModal extends LitElement {
  static override styles = css`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
    }
    :host([open]) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dialog {
      position: relative;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      min-width: 320px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
    }
    :host([size="sm"]) .dialog { width: 320px; }
    :host([size="md"]) .dialog { width: 400px; }
    :host([size="lg"]) .dialog { width: 560px; }
    :host([size="full"]) .dialog { width: 90vw; max-width: 960px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    .header-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      line-height: 1;
    }
    .close-btn:hover { color: #111; }
    .body { padding: 20px; }
    .footer {
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `;

  // Props del componente
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  size: 'sm' | 'md' | 'lg' | 'full' = 'md';

  @property({ type: Boolean })
  clickFuera = true;

  @property({ type: Boolean })
  closeOnEscape = true;

  // Stack de componentes (como el Vue 2)
  @state()
  private componentes: ComponenteEnStack[] = [];

  // ID único para este modal
  private modalId: string;

  constructor() {
    super();
    this.modalId = `flexi-modal-${Math.random().toString(36).substring(2, 9)}`;
  }

  // ============================================
  // Lifecycle - suscripción al EventBus
  // ============================================

  override connectedCallback(): void {
    super.connectedCallback();

    // Suscribirse al EventBus (como el Vue 2 mounted)
    FlexiEventBus.subscribe('flexi:open', this._invocado);
    FlexiEventBus.subscribe('flexi:push', this._invocadoPush);
    FlexiEventBus.subscribe('flexi:close', this._handleClose);
    FlexiEventBus.subscribe('flexi:closeAll', this._handleCloseAll);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    // Desuscribirse (como el Vue 2 beforeDestroy)
    FlexiEventBus.unsubscribe('flexi:open', this._invocado);
    FlexiEventBus.unsubscribe('flexi:push', this._invocadoPush);
    FlexiEventBus.unsubscribe('flexi:close', this._handleClose);
    FlexiEventBus.unsubscribe('flexi:closeAll', this._handleCloseAll);
  }

  // ============================================
  // Handlers del EventBus (como los methods de Vue 2)
  // ============================================

  // Generar ID único
  private generateUUID(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Handler para flexi:open (reemplaza el stack)
  private _invocado = (data: unknown): void => {
    const entry = data as FlexiEntry;

    // Si no es para este modal, ignorar
    if (entry.target !== this.modalId) return;

    // Comportamiento: limpiar stack y agregar uno nuevo (como Vue 2)
    this.componentes = [];
    this.componentes.push({
      id: this.generateUUID(),
      component: entry.component,
      params: entry.params
    });

    this._abrir();
  };

  // Handler para flexi:push (agrega al stack)
  private _invocadoPush = (data: unknown): void => {
    const entry = data as FlexiEntry;

    // Si no es para este modal, ignorar
    if (entry.target !== this.modalId) return;

    // Comportamiento: agregar al stack (como Vue 2)
    this.componentes.push({
      id: this.generateUUID(),
      component: entry.component,
      params: entry.params
    });
  };

  // Handler para flexi:close (cierra el último)
  private _handleClose = (data: unknown): void => {
    const { target } = (data as { target?: string }) || {};

    // Si no es para este modal, ignorar
    if (target && target !== this.modalId) return;

    // Si el modal está abierto, cerrar el último
    if (this.open && this.componentes.length > 0) {
      this.componentes.pop();

      // Si no quedan componentes, cerrar el modal
      if (this.componentes.length === 0) {
        this._cerrar();
      }
    }
  };

  // Handler para flexi:closeAll (cierra todos)
  private _handleCloseAll = (data: unknown): void => {
    const { target } = (data as { target: string }) || {};

    // Si no es para este modal, ignorar
    if (target !== this.modalId) return;

    // Cerrar todos los componentes
    this.componentes = [];
    this._cerrar();
  };

  // ============================================
  // Métodos internos
  // ============================================

  private _abrir(): void {
    this.open = true;
    document.body.style.overflow = 'hidden';
    this._dispatchEvent('flexi:modal-open', {});
  }

  private _cerrar(): void {
    this.open = false;
    document.body.style.overflow = '';
    this._dispatchEvent('flexi:modal-close', {});
  }

  private _dispatchEvent(name: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  // Click en overlay
  private _handleOverlayClick(e: MouseEvent): void {
    if (this.clickFuera && (e.target as HTMLElement).classList.contains('overlay')) {
      this._invocado({});
    }
  }

  // Tecla Escape
  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (this.closeOnEscape && e.key === 'Escape' && this.open) {
      this._invocado({});
    }
  };

  // Cerrar botón
  private _cerrarModal(): void {
    this._invocado({});
  }

  // ============================================
  // Render
  // ============================================

  override render(): TemplateResult {
    // Componente activo (el último del stack, como Vue 2 reverse)
    const componenteActivo = this.componentes[this.componentes.length - 1];

    return html`
      <div
        class="overlay"
        @click=${this._handleOverlayClick}
        @keydown=${this._handleKeyDown}
      >
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="body">
            <slot></slot>
            ${componenteActivo ? html`
              <!-- Aquí se renderiza el componente dinámico -->
              <div class="componente-dinamico" data-component="${componenteActivo.component}">
                <!-- El contenido lo provee el host via slots o JavaScript -->
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

// ============================================
// Export para el DOM
// ============================================

declare global {
  interface HTMLElementTagNameMap {
    'flexi-modal': FlexiModal;
  }
}

export { FlexiModal as default };
