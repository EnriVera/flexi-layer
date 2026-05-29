/**
 * Animation infrastructure using Web Animations API (WAAPI)
 * Provides programmatic control over enter/leave transitions
 */

import { ANIMATION_KEYFRAMES, ANIMATION_DURATION, ANIMATION_EASING } from '../core/constants.js';

export function animateEnter(element: HTMLElement): Animation {
  return element.animate(ANIMATION_KEYFRAMES.ENTER, {
    duration: ANIMATION_DURATION.ENTER,
    easing: ANIMATION_EASING.ENTER,
    fill: 'forwards',
  });
}

export function animateLeave(
  element: HTMLElement,
  onComplete?: () => void
): Animation {
  const animation = element.animate(ANIMATION_KEYFRAMES.LEAVE, {
    duration: ANIMATION_DURATION.LEAVE,
    easing: ANIMATION_EASING.LEAVE,
    fill: 'forwards',
  });

  animation.onfinish = () => {
    onComplete?.();
  };

  return animation;
}
