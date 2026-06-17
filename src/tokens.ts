/**
 * Design tokens for the Badge component set.
 *
 * Each colour maps to four roles used by the three visual variants:
 *  - soft  (Fill=false, Stroke=No):  background = `soft`,  text = `fg`
 *  - solid (Fill=true,  Stroke=No):  background = `solid`, text = `onSolid`
 *  - outline(Fill=false, Stroke=Yes): border    = `border`, text = `fg`
 */

export type BadgeColor =
  | 'grey'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'pink'
  | 'purple';

export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'default' | 'small';

export interface ColorRoles {
  /** Foreground text for the soft & outline variants. */
  fg: string;
  /** Soft (tinted) background. */
  soft: string;
  /** Solid background. */
  solid: string;
  /** Text on top of the solid background. */
  onSolid: string;
  /** Border colour for the outline variant. */
  border: string;
}

export const COLOR_TOKENS: Record<BadgeColor, ColorRoles> = {
  grey: { fg: '#6a7282', soft: '#f3f4f6', solid: '#4a5565', onSolid: '#f9fafb', border: '#e5e7eb' },
  red: { fg: '#e7000b', soft: '#ffe2e2', solid: '#e7000b', onSolid: '#fef2f2', border: '#ffc9c9' },
  green: { fg: '#00a63e', soft: '#dcfce7', solid: '#00a63e', onSolid: '#f0fdf4', border: '#b9f8cf' },
  yellow: { fg: '#a65f00', soft: '#fef9c2', solid: '#f0b100', onSolid: '#fefce8', border: '#fee685' },
  blue: { fg: '#1447e6', soft: '#dbeafe', solid: '#155dfc', onSolid: '#eff6ff', border: '#bedbff' },
  pink: { fg: '#8200db', soft: '#f3e8ff', solid: '#9810fa', onSolid: '#faf5ff', border: '#e9d4ff' },
  purple: { fg: '#432dd7', soft: '#e0e7ff', solid: '#4f39f6', onSolid: '#eef2ff', border: '#c6d2ff' },
};

export interface SizeSpec {
  fontSize: string;
  /** Vertical padding (top & bottom). */
  padY: string;
  /** Horizontal padding (left & right). */
  padX: string;
  /** Outer box height. */
  height: string;
}

export const SIZE_TOKENS: Record<BadgeSize, SizeSpec> = {
  default: { fontSize: '12px', padY: '8px', padX: '6px', height: '25px' },
  small: { fontSize: '10px', padY: '6px', padX: '4px', height: '19px' },
};

export const RADIUS = '4px';
export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const COLORS = Object.keys(COLOR_TOKENS) as BadgeColor[];
export const VARIANTS: BadgeVariant[] = ['soft', 'solid', 'outline'];
export const SIZES: BadgeSize[] = ['default', 'small'];
