/**
 * Unit tests for FlexiBus
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlexiBus, flexiBus, type FlexiEntry } from '../infra/flexi-bus.js';

describe('FlexiBus', () => {
  beforeEach(() => {
    // Reset singleton for test isolation
    FlexiBus.resetInstance();
  });

  afterEach(() => {
    FlexiBus.resetInstance();
  });

  describe('subscribe / unsubscribe / thereAreSubscribers', () => {
    it('should register callback and detect subscriber', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      expect(bus.thereAreSubscribers('modal_push')).toBe(false);

      bus.subscribe('modal_push', handler);

      expect(bus.thereAreSubscribers('modal_push')).toBe(true);
    });

    it('should invoke callback on push', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_push', handler);
      bus.push('modal_push', { component: 'my-modal' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ component: 'my-modal', params: undefined });
    });

    it('should allow multiple subscribers for same event', () => {
      const bus = FlexiBus.getInstance();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.subscribe('modal_push', handler1);
      bus.subscribe('modal_push', handler2);
      bus.push('modal_push', { component: 'my-modal' });

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should remove callback on unsubscribe', () => {
      const bus = FlexiBus.getInstance();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.subscribe('modal_push', handler1);
      bus.subscribe('modal_push', handler2);
      bus.unsubscribe('modal_push', handler1);
      bus.push('modal_push', { component: 'my-modal' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should return false when no subscribers exist', () => {
      const bus = FlexiBus.getInstance();

      expect(bus.thereAreSubscribers('modal_show')).toBe(false);
    });

    it('should return true after subscribe', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_show', handler);

      expect(bus.thereAreSubscribers('modal_show')).toBe(true);
    });
  });

  describe('push / show / close / closeAll emissions', () => {
    it('should emit entry on push', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_push', handler);
      bus.push('modal_push', { component: 'my-modal' });

      expect(handler).toHaveBeenCalledWith({ component: 'my-modal', params: undefined });
    });

    it('should emit entry with params on push', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_push', handler);
      bus.push('modal_push', { component: 'my-modal', params: { title: 'Hello' } });

      expect(handler).toHaveBeenCalledWith({ component: 'my-modal', params: { title: 'Hello' } });
    });

    it('should emit entry on show', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_show_show', handler);
      bus.show('modal_show', { component: 'confirm-dialog' });

      expect(handler).toHaveBeenCalledWith({ component: 'confirm-dialog', params: undefined });
    });

    it('should emit undefined entry on close', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_close', handler);
      bus.close('modal_close');

      expect(handler).toHaveBeenCalledWith(undefined);
    });

    it('should emit on _closeAll channel on closeAll', () => {
      const bus = FlexiBus.getInstance();
      const handler = vi.fn();

      bus.subscribe('modal_close_closeAll', handler);
      bus.closeAll('modal_close');

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('singleton behavior', () => {
    it('should return same instance from getInstance', () => {
      const instance1 = FlexiBus.getInstance();
      const instance2 = FlexiBus.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should reset instance for test isolation', () => {
      const instance1 = FlexiBus.getInstance();
      FlexiBus.resetInstance();
      const instance2 = FlexiBus.getInstance();

      expect(instance1).not.toBe(instance2);
    });
  });
});
