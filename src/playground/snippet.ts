import type { AnimationConfig } from '../animation-types';
import type { BadgeColor, BadgeSize, BadgeVariant } from '../tokens';

export function buildSnippet(opts: {
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
    `badge.textContent = '${opts.label.replace(/'/g, "\\'")}';`,
    ``,
    `const a = new BadgeAnimator(badge, {`,
    `  effect: '${cfg.effect}',`,
    ...(cfg.customName ? [`  customName: '${cfg.customName}',`] : []),
    `});`,
    `a.play();`,
  ].join('\n');
}

export function highlightSnippet(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/('[^']*')/g, '<span class="s">$1</span>')
    .replace(/\b(const|new)\b/g, '<span class="k">$1</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>');
}
