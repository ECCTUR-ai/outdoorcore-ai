import React from 'react';
import { Badge } from './Badge';

interface CampaignStatusBadgeProps {
  status: 'Aktif' | 'Planlandı' | 'Onay Bekliyor' | 'Tamamlandı';
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const mappings = {
    'Aktif': { label: 'Aktif Yayında', variant: 'success' },
    'Planlandı': { label: 'Planlandı', variant: 'primary' },
    'Onay Bekliyor': { label: 'Onay Bekliyor', variant: 'warning' },
    'Tamamlandı': { label: 'Tamamlandı', variant: 'muted' }
  } as const;

  const current = mappings[status] || { label: 'Planlandı', variant: 'muted' };

  return (
    <Badge variant={current.variant} styleType="soft">
      {current.label}
    </Badge>
  );
}
