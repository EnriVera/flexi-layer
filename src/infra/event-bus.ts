/**
 * Event Bus infrastructure
 * Handles document-level CustomEvents for flexi:open, flexi:close
 * Uses composed: true + bubbles: true to traverse Shadow DOM boundaries
 */

import type { FlexiEntry } from '../core/types.js';
import type { FlexiModalHost } from '../core/types.js';
import { MODAL_STACK_MAX } from '../core/constants.js';

export const EVENT_NAME = {
  OPEN: 'flexi:open',
  CLOSE: 'flexi:close',
  BACKDROP_CLICK: 'flexi:backdrop-click',
  SHOW: 'flexi:show',
  HIDE: 'flexi:hide',
} as const;

export type EVENT_NAME = typeof EVENT_NAME[keyof typeof EVENT_NAME];

export class FlexiEventBus {
  private static instance: FlexiEventBus | null = null;
  private stack: FlexiEntry[] = [];

  private constructor() {}

  static getInstance(): FlexiEventBus {
    if (!FlexiEventBus.instance) {
      FlexiEventBus.instance = new FlexiEventBus();
    }
    return FlexiEventBus.instance;
  }

  static resetInstance(): void {
    // For testing purposes only
    if (FlexiEventBus.instance) {
      FlexiEventBus.instance.stack = [];
    }
  }

  reset(): void {
    this.stack = [];
  }

  open(entry: FlexiEntry): void {
    if (this.stack.length >= MODAL_STACK_MAX) {
      throw new Error(`Modal stack overflow: maximum ${MODAL_STACK_MAX} modals allowed`);
    }
    this.stack.push(entry);
    
    // Try to find and show the target modal (may not exist in test environment)
    try {
      const target = document.querySelector<FlexiModalHost>(entry.target);
      if (target) {
        (target as any).component = entry.component;
        (target as any).params = entry.params;
        target.show();
      }
    } catch {
      // Ignore DOM errors in test environments
    }
    
    // Dispatch event
    this.dispatchEvent(EVENT_NAME.OPEN, { detail: entry });
  }

  close(target?: string): void {
    if (!target) {
      const entry = this.stack.pop();
      if (entry) {
        this.hideTarget(entry.target);
        this.dispatchEvent(EVENT_NAME.CLOSE, { detail: { target } });
      }
    } else {
      const idx = this.stack.findLastIndex(e => e.target === target);
      if (idx >= 0) {
        const entry = this.stack.splice(idx, 1)[0];
        this.hideTarget(entry.target);
        this.dispatchEvent(EVENT_NAME.CLOSE, { detail: { target } });
      }
    }
  }

  closeAll(target: string): void {
    const removed = this.stack.filter(e => e.target === target);
    this.stack = this.stack.filter(e => e.target !== target);
    removed.forEach(() => {
      this.hideTarget(target);
      this.dispatchEvent(EVENT_NAME.CLOSE, { detail: { target } });
    });
  }

  getStack(): FlexiEntry[] {
    return [...this.stack];
  }

  private hideTarget(target: string): void {
    try {
      const el = document.querySelector<FlexiModalHost>(target);
      if (el) {
        el.hide();
      }
    } catch {
      // Ignore DOM errors in test environments
    }
  }

  private dispatchEvent(name: string, init?: CustomEventInit): void {
    document.dispatchEvent(new CustomEvent(name, { 
      bubbles: true, 
      composed: true, 
      ...init 
    }));
  }

  static open(entry: FlexiEntry): void {
    FlexiEventBus.getInstance().open(entry);
  }

  static close(target?: string): void {
    FlexiEventBus.getInstance().close(target);
  }

  static closeAll(target: string): void {
    FlexiEventBus.getInstance().closeAll(target);
  }

  static getStack(): FlexiEntry[] {
    return FlexiEventBus.getInstance().getStack();
  }
}

export const flexiOpen = FlexiEventBus.open;
export const flexiClose = FlexiEventBus.close;
export const flexiCloseAll = FlexiEventBus.closeAll;
export const flexiGetStack = FlexiEventBus.getStack;