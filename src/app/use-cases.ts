/**
 * Application layer use cases
 * Orchestration functions that coordinate between event bus, stack, and components
 */

import type { FlexiEntry, FlexiModalHost } from '../core/types.js';
import { flexiOpen, flexiClose, flexiCloseAll, flexiGetStack } from '../infra/event-bus.js';
import { globalModalStack } from './stack.js';

export function openModal(entry: FlexiEntry): void {
  flexiOpen(entry);

  if (entry.target) {
    const modal = document.querySelector<FlexiModalHost>(entry.target);
    if (modal) {
      globalModalStack.push(modal);
    }
  }
}

export function pushModal(entry: FlexiEntry): void {
  // push is now just open with different semantics - keep for compatibility
  flexiOpen(entry);

  if (entry.target) {
    const modal = document.querySelector<FlexiModalHost>(entry.target);
    if (modal) {
      globalModalStack.push(modal);
    }
  }
}

export function closeModal(target?: string): void {
  flexiClose(target);
  
  if (target) {
    const modal = document.querySelector<FlexiModalHost>(target);
    if (modal) {
      const active = globalModalStack.getActive();
      if (active?.modal === modal) {
        globalModalStack.pop();
      }
    }
  } else {
    const active = globalModalStack.getActive();
    if (active) {
      globalModalStack.pop();
    }
  }
}

export function dismissModal(target?: string): void {
  // dismiss is now close - keep for compatibility
  flexiClose(target);
  
  if (target) {
    const modal = document.querySelector<FlexiModalHost>(target);
    if (modal) {
      const active = globalModalStack.getActive();
      if (active?.modal === modal) {
        globalModalStack.pop(target);
      }
    }
  } else {
    globalModalStack.pop();
  }
}

export function getActiveModal(): FlexiModalHost | null {
  const stack = flexiGetStack();
  if (stack.length > 0) {
    const last = stack[stack.length - 1];
    return document.querySelector<FlexiModalHost>(last.target) as FlexiModalHost | null;
  }
  return null;
}