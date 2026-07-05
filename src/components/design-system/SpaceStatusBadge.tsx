import React from 'react';
import { Badge } from './Badge';

interface SpaceStatusBadgeProps {
  status: 'dolu' | 'bos' | 'teklif' | 'bakim' | 'yakinda';
}

export function SpaceStatusBadge({ status }: SpaceStatusBadgeProps) {
  const mappings = {
    dolu: { label: 'Dolu', variant: 'success' },
    bos: { label: 'Müsait (Boş)', variant: 'warning' },
    teklif: { label: 'Teklif Aşamasında', variant: 'primary' },
    bakim: { label: 'Bakımda / Arıza', variant: 'danger' },
    yakinda: { label: 'Yakında Boş', variant: 'info' }
  } as const;

  const current = mappings[status] || { label: 'Bilinmeyen', variant: 'muted' };

  return (
    <Badge variant={current.variant} styleType="soft">
      {current.label}
    </Badge>
  );
}
