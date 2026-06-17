import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { defineAnimatedBadge, type AnimatedBadge } from '../badge-element';
import type { AnimationConfig } from '../animation-types';
import type { BadgeColor, BadgeSize, BadgeVariant } from '../tokens';

defineAnimatedBadge();

export interface BadgeProps {
  id?: string;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Animation config, or `null`/omitted for a static badge. */
  animation?: AnimationConfig | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Imperative handle exposing the underlying animation controls. */
export interface BadgeHandle {
  readonly element: AnimatedBadge | null;
  play(): void;
  pause(): void;
  stop(): void;
  restart(): void;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'animated-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        color?: string;
        variant?: string;
        size?: string;
      };
    }
  }
}

/**
 * Thin React wrapper around `<animated-badge>`. Primitives map to attributes;
 * the `animation` object is assigned imperatively on the underlying element.
 */
export const Badge = React.forwardRef<BadgeHandle, BadgeProps>(function Badge(
  { id, color = 'grey', variant = 'soft', size = 'default', animation = null, children, className, style },
  ref,
) {
  const elRef = useRef<AnimatedBadge | null>(null);

  useEffect(() => {
    if (elRef.current) elRef.current.animation = animation;
  }, [animation]);

  useImperativeHandle(ref, () => ({
    get element() { return elRef.current; },
    play: () => elRef.current?.play(),
    pause: () => elRef.current?.pause(),
    stop: () => elRef.current?.stop(),
    restart: () => elRef.current?.restart(),
  }), []);

  return (
    <animated-badge
      ref={elRef as React.Ref<HTMLElement>}
      id={id}
      color={color}
      variant={variant}
      size={size}
      className={className}
      style={style}
    >
      {children}
    </animated-badge>
  );
});
