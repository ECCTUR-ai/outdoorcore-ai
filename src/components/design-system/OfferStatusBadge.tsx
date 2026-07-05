import React from 'react';
import { Badge } from './Badge';

interface OfferStatusBadgeProps {
  priority: 'Yüksek' | 'Orta' | 'Düşük';
}

export function OfferStatusBadge({ priority }: OfferStatusBadgeProps) {
  const mappings = {
    'Yüksek': { label: 'Yüksek Öncelik', variant: 'danger' },
    'Orta': { label: 'Orta Öncelik', variant: 'warning' },
    'Düşük': { label: 'Düşük Öncelik', variant: 'info' }
  } as const;

  const current = mappings[priority] || { label: 'Orta Öncelik', variant: 'muted' };

  return (
    <Badge variant={current.variant} styleType="soft" className="scale-[0.8] origin-left">
      {current.label}
    </Badge>
  );
}
