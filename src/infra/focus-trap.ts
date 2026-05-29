/**
 * Focus trap implementation following WAI-ARIA patterns
 * Captures Tab/Shift+Tab within a container and restores focus on release
 */

import { FOCUSABLE_SELECTOR } from '../core/constants.js';

let previouslyFocused: HTMLElement | null = null;
let activeTrap: HTMLElement | null = null;
let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

function handleTabKey(container: HTMLElement, event: KeyboardEvent): void {
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (active === last || !container.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }
}

export function createFocusTrap(container: HTMLElement): void {
  previouslyFocused = document.activeElement as HTMLElement;
  activeTrap = container;

  keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && activeTrap) {
      handleTabKey(activeTrap, e);
    }
  };

  document.addEventListener('keydown', keydownHandler);

  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[0].focus();
  } else {
    container.setAttribute('tabindex', '-1');
    container.focus();
  }
}

export function releaseFocusTrap(): void {
  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }

  activeTrap = null;

  if (previouslyFocused && previouslyFocused.focus) {
    previouslyFocused.focus();
    previouslyFocused = null;
  }
}
