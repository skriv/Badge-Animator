/**
 * animated-badge — public entry point.
 *
 * Importing this module auto-registers the `<animated-badge>` custom element.
 * Use {@link BadgeAnimator} to drive animations from code.
 */
export { AnimatedBadge, defineAnimatedBadge } from './badge-element';
export { BadgeAnimator, animateBadge, type AnimatorTarget, type EffectOptions } from './animator';
export {
  type AnimationConfig,
  type AnimationChannel,
  type AnimationEffect,
  ALL_EFFECTS,
  EFFECTS_BY_CHANNEL,
  DEFAULTS,
} from './animation-types';
export {
  COLOR_TOKENS,
  SIZE_TOKENS,
  COLORS,
  VARIANTS,
  SIZES,
  type BadgeColor,
  type BadgeVariant,
  type BadgeSize,
  type ColorRoles,
} from './tokens';

import { defineAnimatedBadge } from './badge-element';

// Auto-define on import in browser environments.
if (typeof customElements !== 'undefined') {
  defineAnimatedBadge();
}
