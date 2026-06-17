import { FONT_FAMILY, RADIUS } from './tokens';

/**
 * Stylesheet injected into the <animated-badge> shadow root.
 *
 * Sizes and variants are driven by host attributes (`size`, `variant`) so they
 * update reliably when changed from code. Colours & animation timing use
 * inherited `--ab-*` custom properties set by the element.
 */
export const STYLES = /* css */ `
:host {
  display: inline-block;
  --ab-font: ${FONT_FAMILY};
  --ab-radius: ${RADIUS};

  --ab-dur: 1200ms;
  --ab-delay: 0ms;
  --ab-easing: cubic-bezier(.4, 0, .2, 1);
  --ab-iter: infinite;
  --ab-intensity: 0.5;
  --ab-play: running;
}
:host([hidden]) { display: none; }

.badge {
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ab-radius);
  border: none;
  background-color: var(--ab-bg, transparent);
  color: var(--ab-fg, currentColor);
  font-family: var(--ab-font);
  font-weight: 500;
  font-style: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transform-origin: center;
}

/* --- Sizes (attribute-driven, always in sync with tokens.ts) --- */
:host([size="default"]) .badge {
  font-size: 12px;
  padding: 8px 6px;
  min-height: 25px;
}
:host([size="small"]) .badge {
  font-size: 10px;
  padding: 6px 4px;
  min-height: 19px;
}

/* Outline variant is the only one with a visible 1px stroke. */
:host([variant="outline"]) .badge {
  border: 1px solid var(--ab-border, transparent);
}

.badge__label {
  display: inline-block;
  pointer-events: none;
  line-height: 20px;
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;
  -webkit-text-box-trim: trim-both;
  -webkit-text-box-edge: cap alphabetic;
}

/* Fallback when text-box-trim is unavailable: cap-height ≈ 1em, not 20px. */
@supports not (text-box-trim: trim-both) {
  .badge__label { line-height: 1; }
}

/* ============================================================= *
 *  Animation effects                                             *
 * ============================================================= */

:host([anim="pulse"]) .badge {
  animation: ab-pulse var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(calc(1 + 0.09 * var(--ab-intensity))); }
}

:host([anim="glow"]) .badge {
  animation: ab-glow var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-glow {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ab-accent) 55%, transparent); }
  70%  { box-shadow: 0 0 0 calc(7px * var(--ab-intensity) + 2px) color-mix(in srgb, var(--ab-accent) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ab-accent) 0%, transparent); }
}

.badge::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(110deg, transparent 35%, var(--ab-shimmer, rgba(255,255,255,0.6)) 50%, transparent 65%);
  background-size: 250% 100%;
  background-repeat: no-repeat;
}
:host([anim="shimmer"]) .badge::after {
  opacity: 1;
  animation: ab-shimmer var(--ab-dur) linear var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-shimmer {
  0%   { background-position: 150% 0; }
  100% { background-position: -150% 0; }
}

/* Gradient: background-image layers on top of background-color. */
:host([anim="gradient"]) .badge {
  background-image: linear-gradient(90deg, var(--ab-grad-a), var(--ab-grad-b), var(--ab-grad-c, var(--ab-grad-a)));
  background-size: 200% 100%;
  animation: ab-gradient var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-gradient {
  0%   { background-position: 0% 50%; }
  100% { background-position: -200% 50%; }
}

:host([anim="blink"][channel="background"]) .badge,
:host([anim="blink"][channel="fill"]) .badge {
  animation: ab-blink-fade var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-blink-fade {
  0%, 100% { opacity: 1; }
  50% { opacity: calc(1 - 0.7 * var(--ab-intensity)); }
}

:host([anim="blink"][channel="stroke"]) .badge {
  animation: ab-blink-border var(--ab-dur) steps(1, end) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-blink-border {
  0%, 50% { border-color: var(--ab-accent); }
  50.01%, 100% { border-color: transparent; }
}

:host([anim="blink"][channel="outline"]) .badge {
  outline: 2px solid var(--ab-accent);
  outline-offset: 2px;
  animation: ab-blink-outline var(--ab-dur) steps(1, end) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-blink-outline {
  0%, 50% { outline-color: var(--ab-accent); }
  50.01%, 100% { outline-color: transparent; }
}

:host([anim="breathe"]) .badge {
  outline-style: solid;
  outline-color: var(--ab-accent);
  outline-width: 0;
  outline-offset: 0;
  animation: ab-breathe var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}
@keyframes ab-breathe {
  0%, 100% {
    outline-width: 0;
    outline-offset: 0;
    outline-color: color-mix(in srgb, var(--ab-accent) 70%, transparent);
  }
  50% {
    outline-width: calc(3px * var(--ab-intensity) + 1px);
    outline-offset: calc(3px * var(--ab-intensity));
    outline-color: color-mix(in srgb, var(--ab-accent) 0%, transparent);
  }
}

:host([anim="custom"]) .badge {
  animation: var(--ab-custom-name, none) var(--ab-dur) var(--ab-easing) var(--ab-delay) var(--ab-iter);
  animation-play-state: var(--ab-play);
}

@media (prefers-reduced-motion: reduce) {
  .badge, .badge::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
}
`;
