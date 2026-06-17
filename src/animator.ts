import type { AnimatedBadge } from './badge-element';
import {
  EFFECTS_BY_CHANNEL,
  type AnimationChannel,
  type AnimationConfig,
  type AnimationEffect,
} from './animation-types';

/** Anything the animator can attach to: an element, or a CSS selector. */
export type AnimatorTarget = AnimatedBadge | Element | string;

/** Per-effect options (everything except the effect/channel themselves). */
export type EffectOptions = Omit<AnimationConfig, 'effect' | 'channel'>;

/**
 * `BadgeAnimator` — a small, code-driven controller for animating an
 * `<animated-badge>`. A badge is **static** until an animator gives it a config;
 * the same animator can `play()`, `pause()`, `stop()`, `restart()` and live
 * `update()` the animation at any time.
 *
 * @example
 * ```ts
 * const a = new BadgeAnimator('#status', { channel: 'outline', effect: 'breathe' });
 * a.pause();
 * a.update({ duration: 600 });
 * a.play();
 * ```
 *
 * @example Fluent helpers
 * ```ts
 * new BadgeAnimator(badge).shimmer({ duration: 1500 });
 * new BadgeAnimator(badge).blink('stroke');
 * ```
 */
export class BadgeAnimator {
  /** The badge element this animator controls. */
  readonly el: AnimatedBadge;
  #config: AnimationConfig | null = null;

  constructor(target: AnimatorTarget, config?: AnimationConfig) {
    this.el = resolveTarget(target);
    if (config) {
      this.set(config);
    } else {
      this.#config = this.el.animation;
    }
  }

  /* ------------------------------- core API ------------------------------ */

  /** Replace the animation with a brand-new configuration and start it. */
  set(config: AnimationConfig): this {
    validate(config);
    this.#config = { ...config };
    this.el.animation = this.#config;
    return this;
  }

  /** Live-patch the current configuration (keeps the animation running). */
  update(patch: Partial<AnimationConfig>): this {
    const base: AnimationConfig = this.#config ?? { effect: patch.effect ?? 'pulse' };
    this.#config = { ...base, ...patch } as AnimationConfig;
    validate(this.#config);
    this.el.animation = this.#config;
    return this;
  }

  /** Resume (or start) playback. */
  play(): this {
    if (this.#config) {
      this.#config.playing = true;
      if (!this.el.animation) this.el.animation = this.#config;
    }
    this.el.play();
    return this;
  }

  /** Pause, holding the current frame. */
  pause(): this {
    if (this.#config) this.#config.playing = false;
    this.el.pause();
    return this;
  }

  /** Toggle between playing and paused. */
  toggle(): this {
    return this.el.isPlaying ? this.pause() : this.play();
  }

  /** Stop and clear the animation — the badge becomes static again. */
  stop(): this {
    this.el.stop();
    this.#config = null;
    return this;
  }

  /** Restart the current animation from frame zero. */
  restart(): this {
    this.el.restart();
    return this;
  }

  /** The current configuration (a copy), or `null` when static. */
  get config(): AnimationConfig | null {
    return this.#config ? { ...this.#config } : null;
  }

  /** Whether an animation is assigned and currently running. */
  get isPlaying(): boolean { return this.el.isPlaying; }

  /** Whether the badge has any animation assigned (running or paused). */
  get isAnimated(): boolean { return this.el.animation !== null; }

  /* --------------------------- fluent shortcuts -------------------------- */

  /** Scale-breathing of the whole chip. */
  pulse(opts: EffectOptions = {}): this {
    return this.set({ channel: 'background', effect: 'pulse', ...opts });
  }

  /** Expanding coloured ring (box-shadow). */
  glow(opts: EffectOptions = {}): this {
    return this.set({ channel: 'background', effect: 'glow', ...opts });
  }

  /** Highlight sweeping across the chip. */
  shimmer(opts: EffectOptions = {}): this {
    return this.set({ channel: 'background', effect: 'shimmer', ...opts });
  }

  /** Animated multi-stop gradient on the background/fill. */
  gradient(opts: EffectOptions = {}): this {
    return this.set({ channel: 'background', effect: 'gradient', ...opts });
  }

  /** Blink a channel on/off. Defaults to the background. */
  blink(channel: AnimationChannel = 'background', opts: EffectOptions = {}): this {
    return this.set({ channel, effect: 'blink', ...opts });
  }

  /** Growing/fading outer ring. Defaults to the `outline` channel. */
  breathe(channel: Extract<AnimationChannel, 'outline' | 'stroke'> = 'outline', opts: EffectOptions = {}): this {
    return this.set({ channel, effect: 'breathe', ...opts });
  }

  /** Run user-registered `@keyframes` by name. */
  custom(customName: string, opts: EffectOptions = {}): this {
    return this.set({ channel: 'background', effect: 'custom', customName, ...opts });
  }
}

/** One-liner factory: `animateBadge('#tag', { effect: 'pulse' })`. */
export function animateBadge(target: AnimatorTarget, config?: AnimationConfig): BadgeAnimator {
  return new BadgeAnimator(target, config);
}

function resolveTarget(target: AnimatorTarget): AnimatedBadge {
  let el: Element | null;
  if (typeof target === 'string') {
    el = document.querySelector(target);
    if (!el) throw new Error(`BadgeAnimator: no element matches selector "${target}".`);
  } else {
    el = target;
  }
  const candidate = el as Partial<AnimatedBadge> | null;
  if (!candidate || typeof candidate.play !== 'function' || typeof candidate.stop !== 'function') {
    throw new Error('BadgeAnimator: target is not an <animated-badge> element. ' +
      'Make sure the element is defined (call defineAnimatedBadge()) and upgraded.');
  }
  return el as AnimatedBadge;
}

function validate(config: AnimationConfig): void {
  const channel: AnimationChannel = config.channel ?? 'background';
  const allowed = EFFECTS_BY_CHANNEL[channel];
  if (allowed && !allowed.includes(config.effect as AnimationEffect)) {
    console.warn(
      `BadgeAnimator: effect "${config.effect}" is unusual for channel "${channel}". ` +
        `Suggested effects: ${allowed.join(', ')}.`,
    );
  }
  if (config.effect === 'custom' && !config.customName) {
    console.warn('BadgeAnimator: effect "custom" requires a `customName` (a registered @keyframes name).');
  }
}
