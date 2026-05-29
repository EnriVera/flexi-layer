/**
 * flexi-modal Web Component
 * Accessible, stackable modal built with Lit 3
 */

import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { modalStyles } from '../styles/modal.css.js';
import { animateEnter, animateLeave } from '../infra/animations.js';
import { createFocusTrap, releaseFocusTrap } from '../infra/focus-trap.js';
import { EVENT_NAME, MODAL_SIZE } from '../core/constants.js';
import type { FlexiModalOptions } from '../core/types.js';
import type { FlexiModalHost } from '../core/types.js';

@customElement('flexi-modal')
export class FlexiModal extends LitElement implements FlexiModalHost {
  static override styles = [modalStyles];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = '';

  @property({ type: String })
  size: 'sm' | 'md' | 'lg' | 'full' = 'md';

  @property({ type: Boolean })
  closeOnOverlay = true;

  @property({ type: Boolean })
  closeOnEscape = true;

  @property({ type: Boolean })
  loading = false;

  @state()
  private _internalContent: string | HTMLElement | null = null;

  @state()
  private _overlayVisible = false;

  private _dialogEl: HTMLElement | null = null;
  private _animation: Animation | null = null;
  private _previousOverflow: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._previousOverflow = document.body.style.overflow;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanup();
  }

  override updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('open')) {
      if (this.open) {
        this._onOpen();
      } else {
        this._onClose();
      }
    }
  }

  private _onOpen(): void {
    this._dialogEl = this.shadowRoot?.querySelector('.dialog') ?? null;
    if (!this._dialogEl) return;

    document.body.style.overflow = 'hidden';
    this._overlayVisible = true;

    requestAnimationFrame(() => {
      if (this._dialogEl) {
        this._animation = animateEnter(this._dialogEl);
        createFocusTrap(this._dialogEl);
      }
    });

    this.dispatchEvent(new CustomEvent(EVENT_NAME.SHOW, { bubbles: true, composed: true }));
  }

  private _onClose(): void {
    if (this._dialogEl) {
      this._animation?.cancel();
      animateLeave(this._dialogEl, () => {
        this._overlayVisible = false;
        releaseFocusTrap();
      });
    }
  }

  private _cleanup(): void {
    this._animation?.cancel();
    releaseFocusTrap();
    document.body.style.overflow = this._previousOverflow ?? '';
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.closeOnEscape && this.open) {
      this.hide();
    }
  }

  private _handleOverlayClick(e: Event): void {
    if (this.closeOnOverlay && e.target === e.currentTarget) {
      this.dispatchEvent(new CustomEvent(EVENT_NAME.BACKDROP_CLICK, { detail: { originalEvent: e }, bubbles: true, composed: true }));
      this.hide();
    }
  }

  show(): void {
    this.open = true;
    this.dispatchEvent(new CustomEvent(EVENT_NAME.OPEN, { detail: {}, bubbles: true, composed: true }));
  }

  hide(): void {
    this.open = false;
    this.dispatchEvent(new CustomEvent(EVENT_NAME.CLOSE, { detail: {}, bubbles: true, composed: true }));
  }

  toggle(): void {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  push(content: string | HTMLElement, position: 'append' | 'prepend' | 'replace' = 'append'): void {
    this._internalContent = content;
    this.dispatchEvent(new CustomEvent(EVENT_NAME.PUSH, { detail: { content, position }, bubbles: true, composed: true }));
  }

  private _getCloseIcon(): TemplateResult {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }

  private _renderLoading(): TemplateResult {
    if (!this.loading) return html``;
    return html`
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    `;
  }

  override render(): TemplateResult {
    const dialogClass = `dialog ${this.size}`;
    const labelledById = 'flexi-modal-title';

    return html`
      <div
        class="overlay ${this._overlayVisible ? 'visible' : ''}"
        role="presentation"
        @click=${this._handleOverlayClick}
        @keydown=${this._handleKeyDown}
      >
        <div
          class=${dialogClass}
          role="dialog"
          aria-modal="true"
          aria-labelledby=${labelledById}
          tabindex="-1"
        >
          <div class="body">
            <slot></slot>
            ${this._internalContent ? html`
              <div class="internal-content">${this._internalContent}</div>
            ` : ''}
          </div>

          ${this._renderLoading()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'flexi-modal': FlexiModal;
  }
}
