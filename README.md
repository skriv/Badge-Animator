# `<animated-badge>`

Framework-agnostic **Web Component** with a **`BadgeAnimator`** constructor for animating background, fill, stroke or outline. Pure CSS animations, zero runtime dependencies.

```bash
npm install
npm run build
npm run typecheck
```

## Quick start

```html
<animated-badge color="blue" variant="soft">Badge</animated-badge>
<script src="animated-badge.min.js"></script>
<script>
  const { BadgeAnimator } = AnimatedBadge;
  new BadgeAnimator('#badge', { effect: 'glow' });
</script>
```

```ts
import { BadgeAnimator } from 'animated-badge';

const a = new BadgeAnimator('#status', { effect: 'gradient' });
a.pause();
a.play();
a.stop();
```

Declarative animation via attributes:

```html
<animated-badge color="red" variant="outline" anim="breathe">Live</animated-badge>
```

## API

### Badge attributes

| Attribute | Values | Default |
| --- | --- | --- |
| `color` | `grey` `red` `green` `yellow` `blue` `pink` `purple` | `grey` |
| `variant` | `soft` · `solid` · `outline` | `soft` |
| `size` | `default` · `small` | `default` |
| `anim` | `glow` `gradient` `shimmer` `breathe` `pulse` `blink` `custom` | — |
| text | slot content or `label` attribute | — |

### `BadgeAnimator`

```ts
new BadgeAnimator(target, config?)
```

`target` — `<animated-badge>` element or CSS selector.

| Method | Description |
| --- | --- |
| `set(config)` | Replace animation and start |
| `update(patch)` | Live-patch config |
| `play()` / `pause()` / `toggle()` | Playback control |
| `stop()` | Remove animation |
| `restart()` | Replay from start |
| `.glow()` `.gradient()` `.breathe()` `.pulse()` … | Fluent shortcuts |

### `AnimationConfig`

| Field | Default |
| --- | --- |
| `channel` | `'background'` |
| `effect` | required |
| `duration` | `1200` (ms) |
| `delay` | `0` |
| `easing` | `cubic-bezier(.4,0,.2,1)` |
| `iterations` | `Infinity` |
| `intensity` | `0.5` |
| `color` | badge accent |
| `playing` | `true` |
| `customName` | for `effect: 'custom'` |

### Custom keyframes

```ts
const badge = document.querySelector('animated-badge')!;
badge.registerKeyframes('spin', `0%{transform:rotate(0)} 100%{transform:rotate(360deg)}`);
new BadgeAnimator(badge).custom('spin');
```

## React (optional)

```bash
npm install animated-badge react react-dom
```

```tsx
import { Badge, type BadgeHandle } from 'animated-badge/react';
import { useRef } from 'react';

function Example() {
  const ref = useRef<BadgeHandle>(null);
  return (
    <>
      <Badge ref={ref} color="blue" variant="solid" animation={{ effect: 'glow' }}>
        New
      </Badge>
      <button onClick={() => ref.current?.pause()}>Pause</button>
    </>
  );
}
```

`react` is a peer dependency for `animated-badge/react` only — the core Web Component has no React dependency.

## Build output

| File | Use |
| --- | --- |
| `dist/animated-badge.esm.js` | `import` (core) |
| `dist/animated-badge.min.js` | `<script>` (global `AnimatedBadge`) |
| `dist/react/index.js` | `import` from `animated-badge/react` |

## Project layout

```
src/
  index.ts           entry point
  badge-element.ts   custom element
  animator.ts        BadgeAnimator
  animation-types.ts types & defaults
  tokens.ts          colours
  styles.ts          shadow-DOM CSS
  react/Badge.tsx    optional React wrapper
```
