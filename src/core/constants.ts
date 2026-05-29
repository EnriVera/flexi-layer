/**
 * Application constants
 * CSS custom properties, ARIA roles, animation timings
 */

export const ARIA_ROLE = {
  DIALOG: 'dialog',
  DIALOG_ALERT: 'alertdialog',
} as const;

export const ARIA_ATTRIBUTE = {
  MODAL: 'true',
  HIDE_LEGEND: 'A modal window is open. Press Escape to close.',
} as const;

export const ANIMATION_DURATION = {
  ENTER: 250,
  LEAVE: 200,
} as const;

export const ANIMATION_EASING = {
  ENTER: 'cubic-bezier(0.32, 0.72, 0, 1)',
  LEAVE: 'cubic-bezier(0.32, 0.72, 0, 1)',
} as const;

export const ANIMATION_KEYFRAMES = {
  ENTER: [
    { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
    { opacity: '1', transform: 'scale(1) translateY(0)' },
  ],
  LEAVE: [
    { opacity: '1', transform: 'scale(1) translateY(0)' },
    { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
  ],
} as const;

export const MODAL_SIZE = {
  SM: '320px',
  MD: '400px',
  LG: '560px',
  FULL: 'min(90vw, 960px)',
} as const;

export const MODAL_SIZE_BREAKPOINT = {
  SM: 320,
  MD: 400,
  LG: 560,
  FULL: 960,
} as const;

export const CSS_CUSTOM_PROPERTIES = {
  WIDTH: '--flexi-modal-width',
  MIN_WIDTH: '--flexi-modal-min-width',
  MIN_HEIGHT: '--flexi-modal-min-height',
  Z_INDEX: '--flexi-modal-z-index',
  BORDER_RADIUS: '--flexi-modal-border-radius',
  BACKDROP_BG: '--flexi-modal-backdrop-bg',
  DIALOG_BG: '--flexi-modal-dialog-bg',
  DIALOG_SHADOW: '--flexi-modal-dialog-shadow',
  COLOR: '--flexi-modal-color',
  FONT_SIZE: '--flexi-modal-font-size',
  ANIMATION_DURATION: '--flexi-modal-animation-duration',
  BODY_PADDING: '--flexi-modal-body-padding',
} as const;

export const CSS_CUSTOM_PROPERTY_DEFAULTS = {
  [CSS_CUSTOM_PROPERTIES.WIDTH]: MODAL_SIZE.MD,
  [CSS_CUSTOM_PROPERTIES.MIN_WIDTH]: '0',
  [CSS_CUSTOM_PROPERTIES.MIN_HEIGHT]: '0',
  [CSS_CUSTOM_PROPERTIES.Z_INDEX]: '1000',
  [CSS_CUSTOM_PROPERTIES.BORDER_RADIUS]: '12px',
  [CSS_CUSTOM_PROPERTIES.BACKDROP_BG]: 'rgba(0, 0, 0, 0.5)',
  [CSS_CUSTOM_PROPERTIES.DIALOG_BG]: '#ffffff',
  [CSS_CUSTOM_PROPERTIES.DIALOG_SHADOW]: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  [CSS_CUSTOM_PROPERTIES.COLOR]: '#1f2937',
  [CSS_CUSTOM_PROPERTIES.FONT_SIZE]: '16px',
  [CSS_CUSTOM_PROPERTIES.ANIMATION_DURATION]: `${ANIMATION_DURATION.ENTER}ms`,
  [CSS_CUSTOM_PROPERTIES.BODY_PADDING]: '20px',
} as const;

export const EVENT_NAME = {
  OPEN: 'flexi:open',
  PUSH: 'flexi:push',
  CLOSE: 'flexi:close',
  DISMISS: 'flexi:dismiss',
  BACKDROP_CLICK: 'flexi:backdrop-click',
  SHOW: 'flexi:show',
  HIDE: 'flexi:hide',
} as const;

export const MODAL_STACK_MAX = 10;

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
