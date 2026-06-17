import { useCallback, useEffect, useRef, useState } from 'react';
import { useDialKit, DialRoot } from 'dialkit';
import 'dialkit/styles.css';

import { BadgeAnimator } from '../animator';
import { Badge, type BadgeHandle } from '../react/Badge';
import type { AnimationEffect } from '../animation-types';
import { COLORS, type BadgeColor, type BadgeSize, type BadgeVariant } from '../tokens';
import { VariantGrid } from './VariantGrid';
import { buildSnippet, highlightSnippet } from './snippet';

const EFFECTS: AnimationEffect[] = ['glow', 'gradient', 'breathe', 'custom'];

function Playground() {
  const badgeRef = useRef<BadgeHandle>(null);
  const animatorRef = useRef<BadgeAnimator | null>(null);
  const [stopped, setStopped] = useState(false);
  const [sizeLabel, setSizeLabel] = useState('');
  const [copied, setCopied] = useState(false);

  const params = useDialKit(
    'Badge',
    {
      label: 'Badge',
      color: { type: 'select', options: [...COLORS], default: 'blue' },
      variant: { type: 'select', options: ['soft', 'solid', 'outline'], default: 'soft' },
      small: false,
      effect: { type: 'select', options: [...EFFECTS], default: 'glow' },
      playback: {
        togglePlay: { type: 'action' },
        stop: { type: 'action' },
        restart: { type: 'action' },
      },
    },
    {
      onAction: (action) => {
        const animator = animatorRef.current;
        if (action === 'playback.togglePlay' || action === 'togglePlay') {
          if (!animator?.isAnimated) {
            setStopped(false);
            applyAnimation();
            return;
          }
          if (animator.isPlaying) animator.pause();
          else animator.play();
          return;
        }
        if (action === 'playback.stop' || action === 'stop') {
          animator?.stop();
          setStopped(true);
          return;
        }
        if (action === 'playback.restart' || action === 'restart') {
          setStopped(false);
          animator?.restart();
        }
      },
    },
  );

  const color = params.color as BadgeColor;
  const variant = params.variant as BadgeVariant;
  const size: BadgeSize = params.small ? 'small' : 'default';
  const effect = params.effect as AnimationEffect;

  const applyAnimation = useCallback(() => {
    const el = badgeRef.current?.element;
    if (!el) return;
    if (!animatorRef.current) {
      el.registerKeyframes('rainbow', '0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)}');
      animatorRef.current = new BadgeAnimator(el);
    }
    animatorRef.current.set({
      effect,
      customName: effect === 'custom' ? 'rainbow' : undefined,
    });
    setStopped(false);
  }, [effect]);

  useEffect(() => {
    if (!stopped) applyAnimation();
  }, [applyAnimation, stopped]);

  useEffect(() => {
    const el = badgeRef.current?.element;
    const badge = el?.shadowRoot?.querySelector('.badge');
    if (!badge) return;
    const r = badge.getBoundingClientRect();
    setSizeLabel(`${size} · ${Math.round(r.width)}×${Math.round(r.height)}px`);
  }, [color, variant, size, params.label, stopped, effect]);

  const snippet = buildSnippet({
    color,
    variant,
    size,
    label: params.label,
    config: { effect, customName: effect === 'custom' ? 'rainbow' : undefined },
    stopped,
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="panel play">
      <div className="stage">
        <Badge
          ref={badgeRef}
          id="status"
          color={color}
          variant={variant}
          size={size}
        >
          {params.label}
        </Badge>
        <span className="size-readout">{sizeLabel}</span>
      </div>
      <div className="code-block">
        <div className="code-header">
          <span>Code</span>
          <button type="button" className="act" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
        </div>
        <pre
          className="code"
          dangerouslySetInnerHTML={{ __html: highlightSnippet(snippet) }}
        />
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <div className="wrap">
        <header>
          <h1>&lt;animated-badge&gt;</h1>
          <p>
            A framework-agnostic Web Component with a code-driven{' '}
            <code className="inline">BadgeAnimator</code> constructor.
          </p>
        </header>

        <h2>Every variant</h2>
        <div className="panel"><VariantGrid /></div>

        <h2>Animation constructor — playground</h2>
        <Playground />
      </div>
      <DialRoot theme="light" position="top-right" defaultOpen />
    </>
  );
}
