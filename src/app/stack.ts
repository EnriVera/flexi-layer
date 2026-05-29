/**
 * Modal Stack management (LIFO)
 * Manages a stack of modals with max capacity enforcement
 */

import type { FlexiEntry } from '../core/types.js';
import type { FlexiModalHost, ModalStackItem } from '../core/types.js';
import { MODAL_STACK_MAX } from '../core/constants.js';

export class ModalStack {
  private stack: ModalStackItem[] = [];

  push(modal: FlexiModalHost, title?: string): void {
    if (this.stack.length >= MODAL_STACK_MAX) {
      throw new Error(`Modal stack overflow: maximum ${MODAL_STACK_MAX} modals allowed`);
    }
    this.stack.push({ modal, title });
  }

  pop(target?: string): ModalStackItem | undefined {
    if (!target) {
      return this.stack.pop();
    }
    const idx = this.stack.findLastIndex(item => item.modal && (item.modal as any).target === target);
    if (idx >= 0) {
      return this.stack.splice(idx, 1)[0];
    }
    return undefined;
  }

  filterByTarget(target: string): FlexiEntry[] {
    return this.stack
      .filter(item => (item.modal as any)?.target === target)
      .map(item => ({
        target: (item.modal as any).target,
        component: (item.modal as any).component || '',
        params: (item.modal as any).params,
      }));
  }

  clearByTarget(target: string): number {
    const before = this.stack.length;
    this.stack = this.stack.filter(item => (item.modal as any)?.target !== target);
    return before - this.stack.length;
  }

  getActive(): ModalStackItem | undefined {
    return this.stack[this.stack.length - 1];
  }

  clear(): void {
    this.stack = [];
  }

  get size(): number {
    return this.stack.length;
  }

  get isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

export const globalModalStack = new ModalStack();
