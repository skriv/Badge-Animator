/**
 * The visual channel an animation drives.
 *  - background: the soft tinted background of the chip
 *  - fill:       the solid background of the chip (semantic alias of background)
 *  - stroke:     the 1px border of the chip
 *  - outline:    an outer outline ring around the chip
 */
export type AnimationChannel = 'background' | 'fill' | 'stroke' | 'outline';

/** Built-in animation presets (plus `custom` for user keyframes). */
export type AnimationEffect =
  | 'pulse'
  | 'glow'
  | 'shimmer'
  | 'gradient'
  | 'blink'
  | 'breathe'
  | 'custom';

export interface AnimationConfig {
  /** Which visual channel to animate. Default: `'background'`. */
  channel?: AnimationChannel;
  /** Which effect to run. */
  effect: AnimationEffect;
  /** Duration of one cycle, in milliseconds. Default: 1200. */
  duration?: number;
  /** Start delay, in milliseconds. Default: 0. */
  delay?: number;
  /** CSS easing function. Default: `'cubic-bezier(.4,0,.2,1)'`. */
  easing?: string;
  /** Number of repeats. `Infinity` (default) loops forever. */
  iterations?: number;
  /** 0..1 strength of the effect (scale amount, glow radius, ...). Default: 0.5. */
  intensity?: number;
  /** Override the accent colour the effect uses (defaults to the badge colour). */
  color?: string;
  /** Start playing immediately. Default: true. */
  playing?: boolean;
  /** For `effect: 'custom'` — the name of a registered `@keyframes`. */
  customName?: string;
}

/** Suggested effects per channel (used for warnings only). */
export const EFFECTS_BY_CHANNEL: Record<AnimationChannel, AnimationEffect[]> = {
  background: ['pulse', 'glow', 'shimmer', 'gradient', 'blink', 'breathe', 'custom'],
  fill: ['pulse', 'glow', 'shimmer', 'gradient', 'blink', 'breathe', 'custom'],
  stroke: ['blink', 'breathe', 'glow', 'pulse', 'gradient', 'shimmer', 'custom'],
  outline: ['breathe', 'blink', 'glow', 'pulse', 'gradient', 'shimmer', 'custom'],
};

export const DEFAULTS = {
  channel: 'background' as AnimationChannel,
  duration: 1200,
  delay: 0,
  easing: 'cubic-bezier(.4,0,.2,1)',
  iterations: Infinity,
  intensity: 0.5,
  playing: true,
};
