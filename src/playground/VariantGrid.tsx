import { Fragment } from 'react';
import { Badge } from '../react/Badge';
import { COLORS, type BadgeSize, type BadgeVariant } from '../tokens';

const COLS: { variant: BadgeVariant; size: BadgeSize; label: string }[] = [
  { variant: 'soft', size: 'default', label: 'Soft' },
  { variant: 'solid', size: 'default', label: 'Solid' },
  { variant: 'outline', size: 'default', label: 'Outline' },
  { variant: 'soft', size: 'small', label: 'Soft · sm' },
  { variant: 'solid', size: 'small', label: 'Solid · sm' },
  { variant: 'outline', size: 'small', label: 'Outline · sm' },
];

export function VariantGrid() {
  return (
    <div className="grid">
      <div className="head" />
      {COLS.map((c) => (
        <div key={c.label} className="head">{c.label}</div>
      ))}
      {COLORS.map((color) => (
        <Fragment key={color}>
          <div className="rowlabel">{color}</div>
          {COLS.map((c) => (
            <div key={`${color}-${c.variant}-${c.size}`} className="cell">
              <Badge color={color} variant={c.variant} size={c.size}>Badge</Badge>
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
