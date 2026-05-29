/**
 * Component tests for flexi-modal
 * Tests properties, methods, and events that can run in happy-dom
 * Note: Full rendering tests require a real browser (@playwright)
 */

import { describe, it, expect, vi } from 'vitest';

describe('flexi-modal component properties', () => {
  it('has default size md', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.size).to.equal('md');
  });

  it('has default open false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.open).to.be.false;
  });

  it('has default closeOnOverlay true', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.closeOnOverlay).to.be.true;
  });

  it('has default closeOnEscape true', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.closeOnEscape).to.be.true;
  });



  it('has default loading false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.loading).to.be.false;
  });

  it('has default empty title', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.title).to.equal('');
  });
});

describe('flexi-modal component property setters', () => {
  it('sets open property', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.open = true;
    expect(modal.open).to.be.true;
  });

  it('sets title property', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.title = 'Test Title';
    expect(modal.title).to.equal('Test Title');
  });

  it('sets size property to lg', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.size = 'lg';
    expect(modal.size).to.equal('lg');
  });

  it('sets size property to sm', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.size = 'sm';
    expect(modal.size).to.equal('sm');
  });

  it('sets size property to full', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.size = 'full';
    expect(modal.size).to.equal('full');
  });

  it('sets closeOnOverlay to false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.closeOnOverlay = false;
    expect(modal.closeOnOverlay).to.be.false;
  });

  it('sets closeOnEscape to false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.closeOnEscape = false;
    expect(modal.closeOnEscape).to.be.false;
  });

  it('sets loading to true', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.loading = true;
    expect(modal.loading).to.be.true;
  });
});

describe('flexi-modal component methods', () => {
  it('show() sets open to true', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.show();
    expect(modal.open).to.be.true;
  });

  it('hide() sets open to false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.open = true;
    modal.hide();
    expect(modal.open).to.be.false;
  });

  it('toggle() toggles open state from false to true', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    expect(modal.open).to.be.false;
    modal.toggle();
    expect(modal.open).to.be.true;
  });

  it('toggle() toggles open state from true to false', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.open = true;
    modal.toggle();
    expect(modal.open).to.be.false;
  });

  it('push() sets internalContent', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.push('Test content');
    expect((modal as any)._internalContent).to.equal('Test content');
  });
});

describe('flexi-modal component events', () => {
  it('fires flexi:open event on show()', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    
    const eventSpy = vi.fn();
    modal.addEventListener('flexi:open', eventSpy);
    
    modal.show();
    
    expect(eventSpy).toHaveBeenCalledTimes(1);
    const event = eventSpy.mock.calls[0][0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('fires flexi:close event on hide()', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.open = true;
    
    const eventSpy = vi.fn();
    modal.addEventListener('flexi:close', eventSpy);
    
    modal.hide();
    
    expect(eventSpy).toHaveBeenCalledTimes(1);
  });

  it('fires flexi:push event on push()', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    
    const eventSpy = vi.fn();
    modal.addEventListener('flexi:push', eventSpy);
    
    modal.push('content');
    
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy.mock.calls[0][0].detail.content).to.equal('content');
  });

  it('event detail contains empty object for open event', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    
    const eventSpy = vi.fn();
    modal.addEventListener('flexi:open', eventSpy);
    
    modal.show();
    
    expect(eventSpy.mock.calls[0][0].detail).toEqual({});
  });

  it('event detail contains empty object for close event', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    const modal = new FlexiModal();
    modal.open = true;
    
    const eventSpy = vi.fn();
    modal.addEventListener('flexi:close', eventSpy);
    
    modal.hide();
    
    expect(eventSpy.mock.calls[0][0].detail).toEqual({});
  });
});

describe('flexi-modal component custom element registration', () => {
  it('is registered as flexi-modal', async () => {
    const { FlexiModal } = await import('./flexi-modal.js');
    expect(customElements.get('flexi-modal')).to.equal(FlexiModal);
  });
});