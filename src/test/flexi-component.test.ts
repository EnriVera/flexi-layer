/**
 * Unit tests for FlexiComponent
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FlexiBus, flexiBus } from '../infra/flexi-bus.js';

describe('FlexiComponent', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    FlexiBus.resetInstance();
  });

  afterEach(() => {
    // Clean up any portals created during test
    document.querySelectorAll('[data-flexi-portal]').forEach(p => p.remove());
    document.body.removeChild(container);
    FlexiBus.resetInstance();
  });

  describe('lifecycle', () => {
    it('should subscribe on connectedCallback', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const subscribeSpy = vi.spyOn(flexiBus, 'subscribe');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      expect(subscribeSpy).toHaveBeenCalledWith('modal_push', expect.any(Function));
    });

    it('should unsubscribe on disconnectedCallback', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const unsubscribeSpy = vi.spyOn(flexiBus, 'unsubscribe');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);
      container.removeChild(component);

      expect(unsubscribeSpy).toHaveBeenCalledWith('modal_push', expect.any(Function));
    });
  });

  describe('component creation', () => {
    it('should create a component instance', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      expect(component).toBeTruthy();
      expect(component.stack).toBeTruthy();
    });

    it('should have empty stack initially', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      expect(component.stack).toHaveLength(0);
    });
  });

  describe('stack behavior', () => {
    it('push() should accumulate entries', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      // Debug: verify subscription
      expect(flexiBus.thereAreSubscribers('modal_push')).toBe(true);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });

      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(2);
    });

    it('show() should replace stack with single entry', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      // Push two entries first
      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(2);

      // show() should REPLACE the stack, not accumulate
      flexiBus.show('modal_push', { component: 'my-modal-new' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(1);
      expect(component.stack[0].component).toBe('my-modal-new');
    });

    it('close() should pop last entry', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(2);

      flexiBus.close('modal_push');
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(1);
    });

    it('closeAll() should clear entire stack', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });
      flexiBus.push('modal_push', { component: 'my-modal-3' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(3);

      flexiBus.closeAll('modal_push');
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(0);
    });
  });

  describe('portal behavior', () => {
    it('push() creates div[data-flexi-portal] at document.body', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      await Promise.resolve();
      await Promise.resolve();

      const portal = document.querySelector('[data-flexi-portal]');
      expect(portal).toBeTruthy();
      expect(document.body.contains(portal)).toBe(true);
    });

    it('push() updates portal.innerHTML with new component', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      await Promise.resolve();
      await Promise.resolve();

      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      const portal = document.querySelector('[data-flexi-portal]') as HTMLElement;
      expect(portal.innerHTML).toContain('my-modal-2');
    });

    it('close() restores previous component to portal', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      await Promise.resolve();
      await Promise.resolve();

      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      const portalBefore = document.querySelector('[data-flexi-portal]') as HTMLElement;
      expect(portalBefore.innerHTML).toContain('my-modal-2');

      flexiBus.close('modal_push');
      await Promise.resolve();
      await Promise.resolve();

      const portalAfter = document.querySelector('[data-flexi-portal]') as HTMLElement;
      expect(portalAfter.innerHTML).toContain('my-modal-1');
    });

    it('close() on single entry removes portal from document.body', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      await Promise.resolve();
      await Promise.resolve();

      expect(document.querySelector('[data-flexi-portal]')).toBeTruthy();

      flexiBus.close('modal_push');
      await Promise.resolve();
      await Promise.resolve();

      expect(document.querySelector('[data-flexi-portal]')).toBeNull();
    });

    it('closeAll() removes portal from document.body', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      expect(document.querySelector('[data-flexi-portal]')).toBeTruthy();

      flexiBus.closeAll('modal_push');
      await Promise.resolve();
      await Promise.resolve();

      expect(document.querySelector('[data-flexi-portal]')).toBeNull();
    });

    it('show() replaces stack and portals', async () => {
      const { FlexiComponent } = await import('../components/flexi-component.js');
      const { flexiBus } = await import('../infra/flexi-bus.js');

      const component = document.createElement('flexi-component') as FlexiComponent;
      component.eventName = 'modal_push';
      container.appendChild(component);

      flexiBus.push('modal_push', { component: 'my-modal-1' });
      flexiBus.push('modal_push', { component: 'my-modal-2' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(2);

      flexiBus.show('modal_push', { component: 'my-modal-show' });
      await Promise.resolve();
      await Promise.resolve();

      expect(component.stack).toHaveLength(1);
      expect(component.stack[0].component).toBe('my-modal-show');

      const portal = document.querySelector('[data-flexi-portal]') as HTMLElement;
      expect(portal.innerHTML).toContain('my-modal-show');
    });
  });
});
