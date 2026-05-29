/**
 * Unit tests for animations module
 * Note: Web Animations API is mocked since happy-dom doesn't support it
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Web Animations API
const mockAnimation = {
  cancel: vi.fn(),
  onfinish: null as (() => void) | null,
  finished: Promise.resolve(),
} as any;

beforeEach(() => {
  Element.prototype.animate = vi.fn().mockImplementation(() => mockAnimation);
});

afterEach(() => {
  delete (Element.prototype as any).animate;
  vi.clearAllMocks();
});

import { animateEnter, animateLeave } from '../infra/animations.js';

describe('animations', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.opacity = '0';
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe('animateEnter', () => {
    it('should call element.animate with enter keyframes', () => {
      const animation = animateEnter(element);
      expect(Element.prototype.animate).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          duration: expect.any(Number),
          easing: expect.any(String),
          fill: 'forwards',
        })
      );
    });

    it('should return an Animation object', () => {
      const animation = animateEnter(element);
      expect(animation).toBeDefined();
      expect(animation.cancel).toBeDefined();
    });
  });

  describe('animateLeave', () => {
    it('should call element.animate with leave keyframes', () => {
      const animation = animateLeave(element);
      expect(Element.prototype.animate).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          duration: expect.any(Number),
          easing: expect.any(String),
          fill: 'forwards',
        })
      );
    });

    it('should return an Animation object', () => {
      const animation = animateLeave(element);
      expect(animation).toBeDefined();
    });

    it('should set onfinish callback', async () => {
      const onComplete = vi.fn();
      const animation = animateLeave(element, onComplete);
      
      // Simulate animation finish
      if (animation.onfinish) {
        animation.onfinish();
      }
      
      expect(onComplete).toHaveBeenCalled();
    });
  });
});
