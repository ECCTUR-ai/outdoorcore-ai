import React from 'react';
import { MapPin } from 'lucide-react';
import { InventoryListPage } from './InventoryListPage';

export function ReklamAlanlari() {
  return (
    <InventoryListPage
      title="Tüm Reklam Alanları"
      subtitle="Sabiha Gökçen reklam envanterinin tamamını yönetin."
      mediaTypeFilter={[]}
      categoryType="all"
      columns={[
        'code',
        'name',
        'terminal',
        'size',
        'adet',
        'face',
        'media_type',
        'category',
        'status',
        'actions'
      ]}
      emptyState="Kayıtlı reklam alanı bulunmamaktadır."
      icon={<MapPin size={16} className="text-blue-500" />}
    />
  );
}
