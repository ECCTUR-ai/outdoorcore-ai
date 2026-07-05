import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Table, TableRow, TableCell } from '@/components/design-system/Table';
import { Input, Select, FormGroup, Label } from '@/components/design-system/Form';
import { Modal } from '@/components/design-system/Modal';
import { Plus, Search, Eye } from 'lucide-react';

export function ReklamAlanlari() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<any | null>(null);

  const spaces = [
    { id: '101', name: 'Levent Metro Billboard A', type: 'Billboard', size: '3.2m x 2.2m', location: 'Levent Metro Çıkışı', price: '₺15.000 / Ay', status: 'Dolu' },
    { id: '102', name: 'Maslak Büyükdere LED Ekran', type: 'Dijital Billboard', size: '12m x 6m', location: 'Büyükdere Caddesi', price: '₺45.000 / Ay', status: 'Boş' },
    { id: '103', name: 'İstanbul Airport Gelen Yolcu Dijital', type: 'Havalimanı Pano', size: '85 inç LED', location: 'Airport Terminal 1', price: '₺75.000 / Ay', status: 'Dolu' },
    { id: '104', name: 'Zorlu Center AVM Raket B2', type: 'AVM Raket', size: '1.2m x 1.8m', location: 'Zorlu AVM Kat 1', price: '₺18.000 / Ay', status: 'Boş' },
    { id: '105', name: 'Kadıköy Rıhtım Megaboard', type: 'Billboard', size: '6m x 3m', location: 'Kadıköy Rıhtım', price: '₺35.000 / Ay', status: 'Dolu' }
  ];

  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          space.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === '' || space.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lokasyon veya alan adı ara..."
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48">
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Tüm Türler</option>
              <option value="Billboard">Billboard</option>
              <option value="Dijital Billboard">Dijital Billboard</option>
              <option value="Havalimanı Pano">Havalimanı Pano</option>
              <option value="AVM Raket">AVM Raket</option>
            </Select>
          </div>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus size={13} />} onClick={() => alert('Yeni reklam alanı oluşturma mockup form modalı tetiklenecek.')}>
          Alan Ekle
        </Button>
      </div>

      {/* Tables List */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Mevcut Reklam Lokasyonları</CardTitle>
            <CardDescription>OutdoorCore sistemindeki tüm billboard, dijital ekran ve panoların listesi.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table headers={['Kod', 'Alan Adı', 'Tür', 'Ölçü / Boyut', 'Lokasyon Detay', 'Aylık Bedel', 'Durum', 'Eylemler']}>
            {filteredSpaces.map(space => (
              <TableRow key={space.id}>
                <TableCell className="font-extrabold text-slate-400">#{space.id}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{space.name}</TableCell>
                <TableCell>
                  <span className="text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-150/30 px-2 py-0.5 rounded text-slate-655 font-bold">
                    {space.type}
                  </span>
                </TableCell>
                <TableCell>{space.size}</TableCell>
                <TableCell>{space.location}</TableCell>
                <TableCell className="font-extrabold text-slate-800 dark:text-slate-200">{space.price}</TableCell>
                <TableCell>
                  {space.status === 'Dolu' ? (
                    <Badge variant="danger">Rezerv Edildi (Dolu)</Badge>
                  ) : (
                    <Badge variant="success">Müsait (Boş)</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="minimal" size="xs" leftIcon={<Eye size={10} />} onClick={() => setSelectedSpace(space)}>
                    Detay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>

      {/* Details View Modal */}
      {selectedSpace && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSpace(null)}
          title={`Lokasyon Detay - #${selectedSpace.id}`}
        >
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-none">{selectedSpace.name}</h4>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
              <div>
                <Label>Alan Türü</Label>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedSpace.type}</span>
              </div>
              <div>
                <Label>Durum</Label>
                <Badge variant={selectedSpace.status === 'Dolu' ? 'danger' : 'success'}>
                  {selectedSpace.status}
                </Badge>
              </div>
              <div>
                <Label>Ebat / Boyut</Label>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedSpace.size}</span>
              </div>
              <div>
                <Label>Lokasyon Açıklaması</Label>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedSpace.location}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
