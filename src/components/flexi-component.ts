/**
 * FlexiComponent - Lit Web Component that subscribes to FlexiBus
 * and renders dynamic components based on received entries
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { flexiBus, type FlexiEntry } from '../infra/flexi-bus.js';

interface ComponenteEnStack {
  id: string;
  component: string;
  params?: Record<string, unknown>;
}

@customElement('flexi-component')
export class FlexiComponent extends LitElement {
  @property({ attribute: 'event-name' })
  eventName = '';

  @property({ attribute: 'on-close', type: Function })
  onClose: ((...args: unknown[]) => void) | null = null;

  @state()
  private stack: ComponenteEnStack[] = [];

  // Portal state
  private _portal: HTMLElement | null = null;

  private _handler: (entry: FlexiEntry | undefined) => void = () => {};
  private _showHandler: (entry: FlexiEntry) => void = () => {};
  private _closeAllHandler: () => void = () => {};

  // Use light DOM instead of shadow DOM for easier testing
  override createRenderRoot(): this {
    return this; // Render directly into element (light DOM)
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._handler = (entry: FlexiEntry | undefined) => {
      if (!entry || !entry.component) {
        // close() pops one entry from the stack
        this._onClose();
      } else {
        // push() accumulates entries onto the stack
        this._ensurePortal();
        this.stack.push({
          id: this._generateUUID(),
          component: entry.component,
          params: entry.params
        });
        this._updatePortalContent();
      }
    };

    // show() replaces entire stack with single entry
    this._showHandler = (entry: FlexiEntry) => {
      this._ensurePortal();
      this.stack = [];
      this.stack.push({
        id: this._generateUUID(),
        component: entry.component,
        params: entry.params
      });
      this._updatePortalContent();
    };

    // closeAll() clears the stack atomically
    this._closeAllHandler = () => {
      this.stack = [];
      this._destroyPortal();
      if (this.onClose) {
        this.onClose();
      }
    };

    if (this.eventName) {
      flexiBus.subscribe(this.eventName, this._handler);
      flexiBus.subscribe(`${this.eventName}_show`, this._showHandler);
      flexiBus.subscribe(`${this.eventName}_closeAll`, this._closeAllHandler);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.eventName) {
      flexiBus.unsubscribe(this.eventName, this._handler);
      flexiBus.unsubscribe(`${this.eventName}_show`, this._showHandler);
      flexiBus.unsubscribe(`${this.eventName}_closeAll`, this._closeAllHandler);
    }
  }

  private _onClose(): void {
    if (this.stack.length > 0) {
      this.stack.pop();
      if (this.stack.length === 0) {
        this._destroyPortal();
        if (this.onClose) {
          this.onClose();
        }
      } else {
        this._updatePortalContent();
      }
    }
  }

  private _generateUUID(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Portal management
  private _ensurePortal(): void {
    if (!this._portal) {
      this._portal = document.createElement('div');
      this._portal.setAttribute('data-flexi-portal', '');
      document.body.appendChild(this._portal);
    }
  }

  private _destroyPortal(): void {
    if (this._portal) {
      this._portal.remove();
      this._portal = null;
    }
  }

  private _updatePortalContent(): void {
    if (!this._portal || this.stack.length === 0) return;

    // Clear existing content
    this._portal.innerHTML = '';

    // Show only the top of stack
    const topEntry = this.stack[this.stack.length - 1];
    const el = document.createElement(topEntry.component);
    el.setAttribute('data-flexi-id', topEntry.id);
    if (topEntry.params) {
      Object.assign(el, topEntry.params);
    }

    // Create flexi-modal wrapper
    const modal = document.createElement('flexi-modal');
    (modal as any).open = true;
    modal.appendChild(el);
    this._portal.appendChild(modal);
  }

  override render() {
    // Portal renders directly to document.body - no render needed here
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'flexi-component': FlexiComponent;
  }
}
