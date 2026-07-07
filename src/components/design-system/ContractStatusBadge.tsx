import React from 'react';
import { Badge } from './Badge';

interface ContractStatusBadgeProps {
  status: 'active' | 'signed' | 'pending' | 'cancelled' | 'expired' | 'draft' | 
          'Aktif' | 'İmza Bekleyen' | 'Yenileme Bekleyen' | 'Süresi Dolmuş' | 'Riskli' | 'İptal' | string;
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const mappings: Record<string, { label: string; variant: 'success' | 'primary' | 'warning' | 'muted' | 'danger' | 'info' }> = {
    // English normalized
    'active': { label: 'Aktif', variant: 'success' },
    'signed': { label: 'İmzalandı', variant: 'success' },
    'pending': { label: 'İmza Bekleyen', variant: 'primary' },
    'cancelled': { label: 'İptal Edildi', variant: 'danger' },
    'expired': { label: 'Süresi Dolmuş', variant: 'muted' },
    'draft': { label: 'Taslak', variant: 'muted' },
    
    // Turkish forms
    'Aktif': { label: 'Aktif', variant: 'success' },
    'İmza Bekleyen': { label: 'İmza Bekleyen', variant: 'primary' },
    'Yenileme Bekleyen': { label: 'Yenileme Bekleyen', variant: 'warning' },
    'Süresi Dolmuş': { label: 'Süresi Dolmuş', variant: 'muted' },
    'Riskli': { label: 'Kritik Risk', variant: 'danger' },
    'İptal': { label: 'İptal Edildi', variant: 'danger' }
  };

  const current = mappings[status] || { label: status || 'Belirsiz', variant: 'muted' };

  return (
    <Badge variant={current.variant as any} styleType="soft">
      {current.label}
    </Badge>
  );
}
