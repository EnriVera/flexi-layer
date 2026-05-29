/**
 * Modal component styles
 * Shadow DOM CSS using Lit css template
 */

import { css, unsafeCSS } from 'lit';
import { MODAL_SIZE_BREAKPOINT, CSS_CUSTOM_PROPERTY_DEFAULTS } from '../core/constants.js';

export const modalStyles = css`
  :host {
    --flexi-modal-width: var(--flexi-modal-width, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-width'])});
    --flexi-modal-min-width: var(--flexi-modal-min-width, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-min-width'])});
    --flexi-modal-min-height: var(--flexi-modal-min-height, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-min-height'])});
    --flexi-modal-z-index: var(--flexi-modal-z-index, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-z-index'])});
    --flexi-modal-border-radius: var(--flexi-modal-border-radius, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-border-radius'])});
    --flexi-modal-backdrop-bg: var(--flexi-modal-backdrop-bg, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-backdrop-bg'])});
    --flexi-modal-dialog-bg: var(--flexi-modal-dialog-bg, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-dialog-bg'])});
    --flexi-modal-dialog-shadow: var(--flexi-modal-dialog-shadow, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-dialog-shadow'])});
    --flexi-modal-color: var(--flexi-modal-color, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-color'])});
    --flexi-modal-font-size: var(--flexi-modal-font-size, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-font-size'])});
    --flexi-modal-animation-duration: var(--flexi-modal-animation-duration, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-animation-duration'])});
    --flexi-modal-body-padding: var(--flexi-modal-body-padding, ${unsafeCSS(CSS_CUSTOM_PROPERTY_DEFAULTS['--flexi-modal-body-padding'])});

    display: contents;
  }

  :host([open]) {
    display: block;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: var(--flexi-modal-backdrop-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--flexi-modal-z-index);
    padding: 16px;
    opacity: 0;
  }

  .overlay.visible {
    opacity: 1;
  }

  .dialog {
    background: var(--flexi-modal-dialog-bg);
    color: var(--flexi-modal-color);
    font-size: var(--flexi-modal-font-size);
    border-radius: var(--flexi-modal-border-radius);
    box-shadow: var(--flexi-modal-dialog-shadow);
    width: var(--flexi-modal-width);
    min-width: var(--flexi-modal-min-width);
    min-height: var(--flexi-modal-min-height);
    max-width: min(90vw, 960px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .dialog.sm {
    width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.SM)}px;
    max-width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.SM)}px;
  }

  .dialog.md {
    width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.MD)}px;
    max-width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.MD)}px;
  }

  .dialog.lg {
    width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.LG)}px;
    max-width: ${unsafeCSS(MODAL_SIZE_BREAKPOINT.LG)}px;
  }

  .dialog.full {
    width: min(90vw, 960px);
    max-width: 960px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .header-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: inherit;
  }

  .close-button {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    transition: opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: -8px -8px -8px 0;
  }

  .close-button:hover {
    opacity: 1;
  }

  .close-button:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .body {
    flex: 1;
    padding: var(--flexi-modal-body-padding);
    overflow-y: auto;
    min-height: 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--flexi-modal-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Slot styling */
  ::slotted(*) {
    box-sizing: border-box;
  }

  .hidden {
    display: none;
  }
`;
