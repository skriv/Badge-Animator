import type { AnimationConfig } from '../animation-types';
import type { BadgeColor, BadgeSize, BadgeVariant } from '../tokens';

export type SnippetFormat = 'js' | 'react';

export function buildSnippet(opts: {
  color: BadgeColor;
  variant: BadgeVariant;
  size: BadgeSize;
  label: string;
  config: AnimationConfig;
  stopped?: boolean;
  format?: SnippetFormat;
}): string {
  return opts.format === 'react' ? buildReactSnippet(opts) : buildJsSnippet(opts);
}

function buildJsSnippet(opts: {
  color: BadgeColor;
  variant: BadgeVariant;
  size: BadgeSize;
  label: string;
  config: AnimationConfig;
  stopped?: boolean;
}): string {
  if (opts.stopped) {
    return `const a = new BadgeAnimator('#status');\na.stop(); // static again`;
  }
  const cfg = opts.config;
  return [
    `const badge = document.querySelector('#status');`,
    `badge.color = '${opts.color}';`,
    `badge.variant = '${opts.variant}';`,
    `badge.size = '${opts.size}';`,
    `badge.textContent = '${escapeJs(opts.label)}';`,
    ``,
    `const a = new BadgeAnimator(badge, {`,
    `  effect: '${cfg.effect}',`,
    ...(cfg.customName ? [`  customName: '${cfg.customName}',`] : []),
    `});`,
    `a.play();`,
  ].join('\n');
}

function buildReactSnippet(opts: {
  color: BadgeColor;
  variant: BadgeVariant;
  size: BadgeSize;
  label: string;
  config: AnimationConfig;
  stopped?: boolean;
}): string {
  const label = escapeJsx(opts.label);
  const sizeAttr = opts.size === 'default' ? '' : `\n  size="${opts.size}"`;

  if (opts.stopped) {
    return [
      `import { Badge } from 'animated-badge/react';`,
      ``,
      `<Badge`,
      `  color="${opts.color}"`,
      `  variant="${opts.variant}"${sizeAttr}`,
      `>`,
      `  ${label}`,
      `</Badge>`,
    ].join('\n');
  }

  const cfg = opts.config;
  const animLines = [
    `  animation={{`,
    `    effect: '${cfg.effect}',`,
    ...(cfg.customName ? [`    customName: '${cfg.customName}',`] : []),
    `  }}`,
  ];

  if (cfg.effect === 'custom' && cfg.customName) {
    return [
      `import { Badge, type BadgeHandle } from 'animated-badge/react';`,
      `import { useEffect, useRef } from 'react';`,
      ``,
      `const ref = useRef<BadgeHandle>(null);`,
      ``,
      `useEffect(() => {`,
      `  ref.current?.element?.registerKeyframes(`,
      `    '${cfg.customName}',`,
      `    '0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)}',`,
      `  );`,
      `}, []);`,
      ``,
      `<Badge`,
      `  ref={ref}`,
      `  color="${opts.color}"`,
      `  variant="${opts.variant}"${sizeAttr}`,
      `  ${animLines.join('\n')}`,
      `>`,
      `  ${label}`,
      `</Badge>`,
    ].join('\n');
  }

  return [
    `import { Badge } from 'animated-badge/react';`,
    ``,
    `<Badge`,
    `  color="${opts.color}"`,
    `  variant="${opts.variant}"${sizeAttr}`,
    `  ${animLines.join('\n')}`,
    `>`,
    `  ${label}`,
    `</Badge>`,
  ].join('\n');
}

function escapeJs(s: string): string {
  return s.replace(/'/g, "\\'");
}

function escapeJsx(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

export function highlightSnippet(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="s">$1</span>')
    .replace(/\b(const|new|import|from|type)\b/g, '<span class="k">$1</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>');
}
