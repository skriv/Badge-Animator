/**
 * animated-badge — public entry point.
 * Auto-registers `<animated-badge>` on import.
 */
export { AnimatedBadge, defineAnimatedBadge } from './badge-element';
export { BadgeAnimator, animateBadge, type AnimatorTarget, type EffectOptions } from './animator';
export {
  type AnimationConfig,
  type AnimationChannel,
  type AnimationEffect,
  DEFAULTS,
} from './animation-types';
export {
  COLOR_TOKENS,
  type BadgeColor,
  type BadgeVariant,
  type BadgeSize,
  type ColorRoles,
} from './tokens';

import { defineAnimatedBadge } from './badge-element';

if (typeof customElements !== 'undefined') {
  defineAnimatedBadge();
}
