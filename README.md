# `<animated-badge>`

A framework-agnostic **Web Component** with a code-driven **`BadgeAnimator` constructor**
for animating a badge's **background, fill, stroke or outline**. A badge is **static**
by default and becomes **animated** entirely from code.

- Custom element with Shadow DOM — works in plain HTML, React, Vue, Svelte, …
- Pure-CSS animations in the component itself (no animation runtime deps)
- 7 colours × `soft` / `solid` / `outline` × `default` / `small`
- Thin **React wrapper** (`Badge`) for ergonomic use in React apps
- **Playground** — React + [DialKit](https://joshpuckett.me/dialkit) for live tuning

```bash
npm install
npm run dev        # playground → http://localhost:5173
npm run typecheck
npm run build      # library .d.ts + playground bundle
```

## Quick start

```html
<script type="module" src="/src/index.ts"></script>

<animated-badge color="green" variant="solid">Active</animated-badge>

<animated-badge color="red" variant="outline" anim="breathe">Live</animated-badge>
```

```ts
import { BadgeAnimator } from './src/index';

const badge = document.querySelector('#status')!;
const a = new BadgeAnimator(badge, { effect: 'glow' });

a.pause();
a.update({ intensity: 0.8 });
a.play();
a.stop();
```

## The Badge

| Prop / attribute | Values | Default |
| --- | --- | --- |
| `color` | `grey` `red` `green` `yellow` `blue` `pink` `purple` | `grey` |
| `variant` | `soft` · `solid` · `outline` | `soft` |
| `size` | `default` · `small` | `default` |
| text | slot content, or the `label` attribute | — |

Colour and size tokens: `src/tokens.ts`.

### Variant behaviour

| Variant | Look |
| --- | --- |
| `soft` | tinted background, coloured text |
| `solid` | filled background, light text |
| `outline` | transparent background, 1px border, coloured text |

Sweeping **gradient** / **shimmer** tints depend on variant:

- **`soft`** — white highlight
- **`outline`** — stroke (`border`) colour
- **`solid`** — lighter mix of the fill colour

## The animation constructor

```ts
new BadgeAnimator(target, config?)
```

- `target` — an `<animated-badge>` element or a CSS selector string
- `config` — [`AnimationConfig`](#animationconfig); omit to keep the badge static

### Methods

| Method | Description |
| --- | --- |
| `set(config)` | Replace the animation and start it |
| `update(patch)` | Live-patch the current config |
| `play()` / `pause()` / `toggle()` | Playback (`animation-play-state`) |
| `stop()` | Remove animation — badge becomes static |
| `restart()` | Replay from frame zero |
| `.glow()` `.gradient()` `.breathe()` `.custom(name)` … | Fluent shortcuts |

Read-only: `config`, `isPlaying`, `isAnimated`, `el`.

### `AnimationConfig`

| Field | Type | Default |
| --- | --- | --- |
| `channel` | `'background'` \| `'fill'` \| `'stroke'` \| `'outline'` | `'background'` |
| `effect` | see below | — |
| `duration` | ms | `1200` |
| `delay` | ms | `0` |
| `easing` | CSS easing | `cubic-bezier(.4,0,.2,1)` |
| `iterations` | number / `Infinity` | `Infinity` |
| `intensity` | `0…1` | `0.5` |
| `color` | accent override | badge colour |
| `playing` | start immediately | `true` |
| `customName` | registered `@keyframes` name (`effect: 'custom'`) | — |

### Effects

| Effect | Description |
| --- | --- |
| `glow` | expanding coloured ring (`box-shadow`) |
| `gradient` | animated background gradient |
| `shimmer` | highlight sweep (`::after` overlay) |
| `breathe` | growing/fading outer outline |
| `pulse` | scale breathing |
| `blink` | fade or border/outline blink |
| `custom` | user-registered `@keyframes` |

The playground exposes **glow**, **gradient**, **breathe**, and **custom**. All effects are available via the API.

### Custom keyframes

```ts
const badge = document.querySelector('animated-badge')!;
badge.registerKeyframes('rainbow', `0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)}`);
new BadgeAnimator(badge).custom('rainbow');
```

## React

```tsx
import { Badge, type BadgeHandle } from './src/react/Badge';
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

`react` is a peer dependency when importing `animated-badge/react`.

## Playground

`npm run dev` opens a light-themed page with:

1. **Every variant** — grid of all colour / variant / size combinations
2. **Playground** — live preview, size readout, generated code snippet with **Copy**

Settings are in the floating **DialKit** panel:

| Control | Type |
| --- | --- |
| Label | text |
| Color | select |
| Variant | select (`soft` / `solid` / `outline`) |
| Small | toggle (`false` = default, `true` = small) |
| Effect | select (`glow` / `gradient` / `breathe` / `custom`) |
| Playback | actions — Toggle Play, Stop, Restart |

## Notes

- Animations honour `prefers-reduced-motion`.
- Chip height uses `text-box-trim` with a padding fallback for older engines.
- `color-mix()` derives glow, shimmer, and gradient accents.

## Project layout

```
src/
  index.ts              public entry (auto-registers <animated-badge>)
  badge-element.ts      custom element
  animator.ts           BadgeAnimator constructor
  animation-types.ts    animation types & defaults
  tokens.ts             colour & size tokens
  styles.ts             shadow-DOM CSS + keyframes
  react/Badge.tsx       thin React wrapper
  playground/           React + DialKit UI
    App.tsx
    VariantGrid.tsx
    snippet.ts
  main.tsx              playground entry
index.html              playground shell
vite.config.ts
```
