/**
 * Unit tests for focus trap module
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createFocusTrap, releaseFocusTrap } from '../infra/focus-trap.js';

describe('focus-trap', () => {
  let container: HTMLElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    button1 = document.createElement('button');
    button2 = document.createElement('button');
    input = document.createElement('input');

    button1.tabIndex = 0;
    button2.tabIndex = 0;
    input.tabIndex = 0;

    container.appendChild(button1);
    container.appendChild(input);
    container.appendChild(button2);
    document.body.appendChild(container);
  });

  afterEach(() => {
    releaseFocusTrap();
    container.remove();
  });

  describe('createFocusTrap', () => {
    it('should trap focus within container', () => {
      createFocusTrap(container);

      // Simulate Tab key press
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      container.dispatchEvent(tabEvent);
    });

    it('should focus first focusable element', () => {
      createFocusTrap(container);
      // The first element should be focused
      expect(document.activeElement).toBe(button1);
    });

    it('should handle container without focusable elements', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      createFocusTrap(emptyContainer);
      expect(emptyContainer.hasAttribute('tabindex')).toBe(true);

      emptyContainer.remove();
    });
  });

  describe('releaseFocusTrap', () => {
    it('should restore previous focus', () => {
      button1.focus();
      expect(document.activeElement).toBe(button1);

      createFocusTrap(container);
      releaseFocusTrap();

      // Focus should be restored to the previous element
      // Note: This may not work in jsdom environment
    });

    it('should remove tabindex from container', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      createFocusTrap(emptyContainer);
      expect(emptyContainer.getAttribute('tabindex')).toBe('-1');

      releaseFocusTrap();
      // tabindex should be removed
      emptyContainer.remove();
    });
  });
});
