import React from 'react';
import { Badge } from './Badge';

interface ContractStatusBadgeProps {
  status: 'Aktif' | 'İmza Bekleyen' | 'Yenileme Bekleyen' | 'Süresi Dolmuş' | 'Riskli';
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const mappings = {
    'Aktif': { label: 'Aktif', variant: 'success' },
    'İmza Bekleyen': { label: 'İmza Bekleyen', variant: 'primary' },
    'Yenileme Bekleyen': { label: 'Yenileme Bekleyen', variant: 'warning' },
    'Süresi Dolmuş': { label: 'Süresi Dolmuş', variant: 'muted' },
    'Riskli': { label: 'Kritik Risk', variant: 'danger' }
  } as const;

  const current = mappings[status] || { label: 'Bilinmeyen', variant: 'muted' };

  return (
    <Badge variant={current.variant} styleType="soft">
      {current.label}
    </Badge>
  );
}
