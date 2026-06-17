import {
  COLOR_TOKENS,
  type BadgeColor,
  type BadgeVariant,
  type BadgeSize,
} from './tokens';
import { STYLES } from './styles';
import { DEFAULTS, type AnimationConfig, type AnimationChannel, type AnimationEffect } from './animation-types';

const VALID_COLORS = new Set(Object.keys(COLOR_TOKENS));
const VALID_VARIANTS = new Set<BadgeVariant>(['soft', 'solid', 'outline']);

/**
 * `<animated-badge>` — a framework-agnostic badge custom element. It is static
 * by default; pass an {@link AnimationConfig} (via the `animation` property,
 * the declarative attributes, or a {@link BadgeAnimator}) to animate its
 * background, fill, stroke or outline.
 *
 * @example
 * ```html
 * <animated-badge color="green" variant="solid">Active</animated-badge>
 * ```
 */
export class AnimatedBadge extends HTMLElement {
  static readonly observedAttributes = [
    'color', 'variant', 'size', 'label',
    'anim', 'channel', 'duration', 'delay', 'easing', 'iterations', 'intensity', 'accent', 'paused',
  ];

  #root: ShadowRoot;
  #slot!: HTMLSlotElement;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = STYLES;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.part = 'badge';
    const label = document.createElement('span');
    label.className = 'badge__label';
    label.part = 'label';
    this.#slot = document.createElement('slot');
    label.appendChild(this.#slot);
    badge.appendChild(label);
    this.#root.append(style, badge);
  }

  connectedCallback() {
    if (!this.hasAttribute('color')) this.setAttribute('color', 'grey');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'soft');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'default');
    this.#sync();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  /* ----------------------------- typed props ----------------------------- */

  get color(): BadgeColor { return (this.getAttribute('color') as BadgeColor) ?? 'grey'; }
  set color(v: BadgeColor) { this.setAttribute('color', v); }

  get variant(): BadgeVariant { return (this.getAttribute('variant') as BadgeVariant) ?? 'soft'; }
  set variant(v: BadgeVariant) { this.setAttribute('variant', v); }

  get size(): BadgeSize { return (this.getAttribute('size') as BadgeSize) ?? 'default'; }
  set size(v: BadgeSize) { this.setAttribute('size', v); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) { this.setAttribute('label', v); }

  /* --------------------------- animation control ------------------------- */

  /** Get/set the full animation configuration. `null` clears any animation. */
  get animation(): AnimationConfig | null {
    const effect = this.getAttribute('anim') as AnimationEffect | null;
    if (!effect) return null;
    const iterAttr = this.getAttribute('iterations');
    return {
      effect,
      channel: (this.getAttribute('channel') as AnimationChannel) ?? DEFAULTS.channel,
      duration: numAttr(this, 'duration', DEFAULTS.duration),
      delay: numAttr(this, 'delay', DEFAULTS.delay),
      easing: this.getAttribute('easing') ?? DEFAULTS.easing,
      iterations: iterAttr == null || iterAttr === 'infinite' ? Infinity : Number(iterAttr),
      intensity: numAttr(this, 'intensity', DEFAULTS.intensity),
      color: this.getAttribute('accent') ?? undefined,
      customName: this.getAttribute('custom-name') ?? undefined,
      playing: !this.hasAttribute('paused'),
    };
  }

  set animation(config: AnimationConfig | null) {
    if (!config) { this.stop(); return; }
    const set = (name: string, value: string | number | null | undefined) => {
      if (value == null || value === '') this.removeAttribute(name);
      else this.setAttribute(name, String(value));
    };
    set('channel', config.channel ?? DEFAULTS.channel);
    set('duration', config.duration);
    set('delay', config.delay);
    set('easing', config.easing);
    set('intensity', config.intensity);
    set('accent', config.color);
    set('custom-name', config.customName);
    if (config.iterations != null) {
      set('iterations', config.iterations === Infinity ? 'infinite' : config.iterations);
    } else {
      this.removeAttribute('iterations');
    }
    if (config.playing === false) this.setAttribute('paused', '');
    else this.removeAttribute('paused');
    // set the effect LAST so the animation kicks in once everything is in place
    this.setAttribute('anim', config.effect);
  }

  /** Resume a paused animation. */
  play(): void { this.removeAttribute('paused'); }

  /** Pause the animation, holding the current frame. */
  pause(): void { this.setAttribute('paused', ''); }

  /** Stop and remove the animation, returning the badge to its static look. */
  stop(): void {
    this.removeAttribute('anim');
    this.removeAttribute('paused');
  }

  /** Restart the animation from the beginning. */
  restart(): void {
    const effect = this.getAttribute('anim');
    if (!effect) return;
    this.removeAttribute('anim');
    // force a reflow so the browser drops the running animation
    void this.offsetWidth;
    this.setAttribute('anim', effect);
  }

  get isPlaying(): boolean {
    return this.hasAttribute('anim') && !this.hasAttribute('paused');
  }

  #customStyle?: HTMLStyleElement;
  #customNames = new Set<string>();

  /**
   * Register a custom `@keyframes` rule inside this element's shadow root so it
   * can be used with `effect: 'custom'`. `body` may be the full
   * `@keyframes name { ... }` rule or just the inner frames.
   */
  registerKeyframes(name: string, body: string): void {
    if (this.#customNames.has(name)) return;
    this.#customNames.add(name);
    if (!this.#customStyle) {
      this.#customStyle = document.createElement('style');
      this.#root.appendChild(this.#customStyle);
    }
    const trimmed = body.trim();
    const rule = trimmed.startsWith('@keyframes') ? trimmed : `@keyframes ${name} { ${trimmed} }`;
    this.#customStyle.textContent += `\n${rule}`;
  }

  /* ------------------------------- internal ------------------------------ */

  #sync(): void {
    const color: BadgeColor = VALID_COLORS.has(this.getAttribute('color') ?? '')
      ? (this.getAttribute('color') as BadgeColor) : 'grey';
    const variant: BadgeVariant = VALID_VARIANTS.has(this.getAttribute('variant') as BadgeVariant)
      ? (this.getAttribute('variant') as BadgeVariant) : 'soft';

    const roles = COLOR_TOKENS[color];
    const s = this.style;

    let bg: string, fg: string, border: string;
    if (variant === 'solid') {
      bg = roles.solid; fg = roles.onSolid; border = roles.border;
    } else if (variant === 'outline') {
      bg = 'transparent'; fg = roles.fg; border = roles.border;
    } else {
      bg = roles.soft; fg = roles.fg; border = roles.border;
    }
    s.setProperty('--ab-bg', bg);
    s.setProperty('--ab-fg', fg);
    s.setProperty('--ab-border', border);

    const accent = this.getAttribute('accent') || roles.solid;
    s.setProperty('--ab-accent', accent);

    // Gradient stops — high contrast so the effect is clearly visible.
    if (variant === 'solid') {
      s.setProperty('--ab-grad-a', roles.solid);
      s.setProperty('--ab-grad-b', `color-mix(in srgb, ${roles.solid} 55%, white)`);
      s.setProperty('--ab-grad-c', roles.solid);
      s.setProperty('--ab-shimmer', 'color-mix(in srgb, white 60%, transparent)');
    } else if (variant === 'outline') {
      // Sweeping gradient / shimmer in stroke colour.
      s.setProperty('--ab-grad-a', 'transparent');
      s.setProperty('--ab-grad-b', roles.border);
      s.setProperty('--ab-grad-c', 'transparent');
      s.setProperty('--ab-shimmer', `color-mix(in srgb, ${roles.border} 85%, transparent)`);
    } else {
      // Soft: sweeping gradient / shimmer in white.
      s.setProperty('--ab-grad-a', roles.soft);
      s.setProperty('--ab-grad-b', `color-mix(in srgb, white 72%, ${roles.soft})`);
      s.setProperty('--ab-grad-c', roles.soft);
      s.setProperty('--ab-shimmer', 'color-mix(in srgb, white 80%, transparent)');
    }

    // Timing variables.
    s.setProperty('--ab-dur', `${numAttr(this, 'duration', DEFAULTS.duration)}ms`);
    s.setProperty('--ab-delay', `${numAttr(this, 'delay', DEFAULTS.delay)}ms`);
    s.setProperty('--ab-easing', this.getAttribute('easing') || DEFAULTS.easing);
    const iter = this.getAttribute('iterations');
    s.setProperty('--ab-iter', !iter || iter === 'infinite' ? 'infinite' : iter);
    s.setProperty('--ab-intensity', String(numAttr(this, 'intensity', DEFAULTS.intensity)));
    s.setProperty('--ab-play', this.hasAttribute('paused') ? 'paused' : 'running');
    const customName = this.getAttribute('custom-name');
    if (customName) s.setProperty('--ab-custom-name', customName);

    // Label fallback (used when no slotted content is provided).
    this.#slot.textContent = this.getAttribute('label') ?? '';
  }
}

function numAttr(el: Element, name: string, fallback: number): number {
  const raw = el.getAttribute(name);
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Register the element (idempotent). Returns the tag name. */
export function defineAnimatedBadge(tagName = 'animated-badge'): string {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, AnimatedBadge);
  }
  return tagName;
}

declare global {
  interface HTMLElementTagNameMap {
    'animated-badge': AnimatedBadge;
  }
}
