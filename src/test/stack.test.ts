/**
 * Unit tests for ModalStack
 */

import { describe, it, expect } from 'vitest';
import { ModalStack } from '../app/stack.js';

describe('ModalStack', () => {
  let mockModal1: any;
  let mockModal2: any;

  beforeEach(() => {
    mockModal1 = { show: vi.fn(), hide: vi.fn() };
    mockModal2 = { show: vi.fn(), hide: vi.fn() };
  });

  describe('push', () => {
    it('should add modal to stack', () => {
      const stack = new ModalStack();
      stack.push(mockModal1, 'Modal 1');

      expect(stack.size).toBe(1);
      expect(stack.isEmpty).toBe(false);
    });

    it('should store title with modal', () => {
      const stack = new ModalStack();
      stack.push(mockModal1, 'Test Title');

      const active = stack.getActive();
      expect(active?.title).toBe('Test Title');
    });

    it('should throw on overflow', () => {
      const stack = new ModalStack();

      // Push 10 modals (max)
      for (let i = 0; i < 10; i++) {
        stack.push(mockModal1);
      }

      // 11th should throw
      expect(() => stack.push(mockModal2)).toThrow(/maximum 10 modals allowed/);
    });
  });

  describe('pop', () => {
    it('should remove and return last modal', () => {
      const stack = new ModalStack();
      stack.push(mockModal1, 'Modal 1');
      stack.push(mockModal2, 'Modal 2');

      const popped = stack.pop();

      expect(popped?.title).toBe('Modal 2');
      expect(stack.size).toBe(1);
    });

    it('should return undefined when stack is empty', () => {
      const stack = new ModalStack();
      expect(stack.pop()).toBeUndefined();
    });
  });

  describe('getActive', () => {
    it('should return last pushed modal', () => {
      const stack = new ModalStack();
      stack.push(mockModal1, 'Modal 1');
      stack.push(mockModal2, 'Modal 2');

      const active = stack.getActive();
      expect(active?.modal).toBe(mockModal2);
      expect(active?.title).toBe('Modal 2');
    });

    it('should return undefined when empty', () => {
      const stack = new ModalStack();
      expect(stack.getActive()).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all modals from stack', () => {
      const stack = new ModalStack();
      stack.push(mockModal1);
      stack.push(mockModal2);

      stack.clear();

      expect(stack.size).toBe(0);
      expect(stack.isEmpty).toBe(true);
      expect(stack.getActive()).toBeUndefined();
    });
  });
});
