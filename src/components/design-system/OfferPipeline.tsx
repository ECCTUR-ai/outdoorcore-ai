import React from 'react';
import { Offer } from '@/data/offers';
import { OfferColumn } from './OfferColumn';

interface OfferPipelineProps {
  offers: Offer[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OfferPipeline({ offers, selectedId, onSelect }: OfferPipelineProps) {
  const stages: Offer['stage'][] = [
    'Rezerve',
    'Teklif Gönderildi',
    'Müşteri Onayı',
    'Sözleşme Bekliyor',
    'Sözleşme İmzalandı',
    'Yayında',
    'Tamamlandı',
    'İptal'
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 select-none scrollbar-thin scroll-smooth mask-image">
      {stages.map(stage => (
        <OfferColumn
          key={stage}
          stage={stage}
          offers={offers}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
