/**
 * Unit tests for FlexiEventBus helpers (new API)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlexiEventBus, flexiOpen, flexiClose, flexiCloseAll, flexiGetStack } from '../infra/event-bus.js';

describe('FlexiEventBus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the stack between tests
    FlexiEventBus.getInstance().reset();
  });

  describe('open', () => {
    it('should dispatch flexi:open event', () => {
      const handler = vi.fn();
      document.addEventListener('flexi:open', handler);

      flexiOpen({ target: '#test-modal', component: 'my-component' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.target).toBe('#test-modal');

      document.removeEventListener('flexi:open', handler);
    });

    it('should include component and params in detail', () => {
      const handler = vi.fn();
      document.addEventListener('flexi:open', handler);

      flexiOpen({
        target: '#test-modal',
        component: 'my-component',
        params: { foo: 'bar' },
      });

      expect(handler.mock.calls[0][0].detail.component).toBe('my-component');
      expect(handler.mock.calls[0][0].detail.params).toEqual({ foo: 'bar' });

      document.removeEventListener('flexi:open', handler);
    });

    it('should add entry to internal stack', () => {
      const beforeStack = flexiGetStack();
      
      flexiOpen({ target: '#test-modal', component: 'test-comp' });
      
      const afterStack = flexiGetStack();
      expect(afterStack.length).toBe(beforeStack.length + 1);
    });
  });

  describe('close', () => {
    it('should dispatch flexi:close event', () => {
      flexiOpen({ target: '#test-modal', component: 'comp' });
      
      const handler = vi.fn();
      document.addEventListener('flexi:close', handler);

      flexiClose('#test-modal');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.target).toBe('#test-modal');

      document.removeEventListener('flexi:close', handler);
    });

    it('should pop last entry when no target provided', () => {
      flexiOpen({ target: '#modal-1', component: 'comp1' });
      flexiOpen({ target: '#modal-2', component: 'comp2' });
      
      const beforeStack = flexiGetStack();
      
      flexiClose();
      
      const afterStack = flexiGetStack();
      expect(afterStack.length).toBe(beforeStack.length - 1);
    });

    it('should dispatch with empty detail when no target', () => {
      flexiOpen({ target: '#test-modal', component: 'comp' });
      
      const handler = vi.fn();
      document.addEventListener('flexi:close', handler);

      flexiClose();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail).toEqual({});

      document.removeEventListener('flexi:close', handler);
    });
  });

  describe('closeAll', () => {
    it('should dispatch flexi:close for each removed entry', () => {
      flexiOpen({ target: '#modal-a', component: 'comp-a' });
      flexiOpen({ target: '#modal-a', component: 'comp-b' });
      flexiOpen({ target: '#modal-b', component: 'comp-c' });
      
      const handler = vi.fn();
      document.addEventListener('flexi:close', handler);

      flexiCloseAll('#modal-a');

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should remove all entries for target', () => {
      flexiOpen({ target: '#modal-a', component: 'comp-a' });
      flexiOpen({ target: '#modal-a', component: 'comp-b' });
      flexiOpen({ target: '#modal-b', component: 'comp-c' });
      
      flexiCloseAll('#modal-a');
      
      const stack = flexiGetStack().filter(e => e.target === '#modal-a');
      expect(stack.length).toBe(0);
    });
  });

  describe('getStack', () => {
    it('should return copy of stack', () => {
      const stack = flexiGetStack();
      
      flexiOpen({ target: '#test-modal', component: 'comp' });
      
      const newStack = flexiGetStack();
      expect(newStack.length).toBe(stack.length + 1);
    });

    it('should return empty array initially', () => {
      expect(flexiGetStack()).toEqual([]);
    });
  });
});