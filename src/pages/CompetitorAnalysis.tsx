import React, { useState } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Coins, 
  Sparkles,
  PieChart,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { Competitor } from '@/data/competitors';
import { competitorRepository } from '@/repositories';
import { Badge } from '@/components/design-system/Badge';
import { Button } from '@/components/design-system/Button';

export function CompetitorAnalysis() {
  const competitorsList = competitorRepository.getAllSync();
  const competitorKpis = competitorRepository.getKpisSync();
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor>(competitorsList[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredCompetitors = competitorsList.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comp.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || comp.regions.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 p-5 rounded-3xl border border-white/5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Rakip Analiz & Pazar Zekası</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Rakiplerin envanter doluluk oranları, tahmini satış fiyatları, aktif kampanyaları ve OutdoorCore pazar karşılaştırma endeksi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xs" leftIcon={<PieChart size={10} />} onClick={() => alert('Pazar payı excel raporu indiriliyor...')}>
            Pazar Raporu PDF
          </Button>
          <Button variant="primary" size="xs" leftIcon={<Sparkles size={10} />} onClick={() => alert('AI fiyat simülasyonu çalıştırıldı.')}>
            Fiyat Simülasyonu
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">İzlenen Rakip</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.totalCompetitors}</span>
            <span className="text-[8px] text-slate-500 font-bold">Firma</span>
          </div>
        </div>
        <div className="dark-glass-card border border-blue-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-blue-400">Rakip Reklam Alanı</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.competitorSpaces}</span>
            <span className="text-[8px] text-blue-400 font-bold">Pano</span>
          </div>
        </div>
        <div className="dark-glass-card border border-indigo-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-indigo-400">Rakip Kampanya</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.competitorCampaigns}</span>
            <span className="text-[8px] text-indigo-400 font-bold">Aktif</span>
          </div>
        </div>
        <div className="dark-glass-card border border-amber-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-amber-400">Tahmini Doluluk</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.averageOccupancy}</span>
            <span className="text-[8px] text-amber-400 font-bold">Ortalama</span>
          </div>
        </div>
        <div className="dark-glass-card border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Fiyat Ortalaması</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.averagePriceIndex}</span>
            <span className="text-[8px] text-slate-500 font-bold">CPM Eş.</span>
          </div>
        </div>
        <div className="dark-glass-card border border-emerald-500/10 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider text-emerald-450">Bizim Pazar Payımız</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-md font-black text-white">{competitorKpis.marketShareOutdoorCore}</span>
            <span className="text-[8px] text-emerald-450 font-bold">Lider</span>
          </div>
        </div>
      </div>

      {/* Main Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Panel: Competitor Search List */}
        <div className="order-2 lg:order-none lg:col-span-3 space-y-4">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Search size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Rakip Arama & Filtre</h4>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Rakip firma adı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Region select filter */}
            <div className="space-y-1.5 text-left">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Faaliyet Bölgesi</span>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'TÜM BÖLGELER', value: 'all' },
                  { label: 'İSTANBUL', value: 'İstanbul' },
                  { label: 'ANKARA', value: 'Ankara' },
                  { label: 'İZMİR', value: 'İzmir' },
                  { label: 'ANTALYA', value: 'Antalya' }
                ].map(reg => (
                  <button
                    key={reg.value}
                    onClick={() => setSelectedRegion(reg.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                      selectedRegion === reg.value 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                        : 'text-slate-400 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orta Panel: Competitor details grid */}
        <div className="order-1 lg:order-none lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompetitors.map(comp => {
              const isSelected = selectedCompetitor.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompetitor(comp)}
                  className={`dark-glass-card border rounded-2xl p-4.5 cursor-pointer duration-200 select-none text-left space-y-3 ${
                    isSelected 
                      ? 'border-blue-500/35 bg-[#22314a]/10' 
                      : 'border-white/5 hover:border-slate-700 bg-slate-900/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-black">
                        {comp.logo}
                      </div>
                      <div className="text-left leading-none">
                        <span className="text-[10px] font-black text-white block leading-none">{comp.name}</span>
                        <span className="text-[8px] text-slate-550 block mt-0.5">{comp.website}</span>
                      </div>
                    </div>
                    <Badge variant="primary">{comp.estimatedOccupancy}% Doluluk</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-white/3 text-center">
                    <div className="bg-slate-950/20 p-1.5 rounded-lg">
                      <span className="text-[7px] text-slate-500 font-bold uppercase block">LED</span>
                      <span className="text-[9.5px] font-black text-white">{comp.ledCount}</span>
                    </div>
                    <div className="bg-slate-950/20 p-1.5 rounded-lg">
                      <span className="text-[7px] text-slate-500 font-bold uppercase block">B.board</span>
                      <span className="text-[9.5px] font-black text-white">{comp.billboardCount}</span>
                    </div>
                    <div className="bg-slate-950/20 p-1.5 rounded-lg">
                      <span className="text-[7px] text-slate-500 font-bold uppercase block">L.box</span>
                      <span className="text-[9.5px] font-black text-white">{comp.lightboxCount}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold uppercase pt-1">
                    <span>Ortalama Fiyat: <strong className="text-slate-350">{comp.averagePrice}</strong></span>
                    <span>{comp.activeCampaignsCount} Kampanya</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Panel: Side-by-Side Comparison */}
        <div className="order-3 lg:order-none lg:col-span-3">
          <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
              <Award size={12} />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Biz VS Rakip</h4>
            </div>

            {/* VS Header display */}
            <div className="p-3 bg-[#08111f]/60 rounded-xl border border-white/5 text-center flex justify-between items-center select-none">
              <div className="text-center space-y-1">
                <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-black uppercase">OC AI</span>
                <span className="text-[9.5px] font-black text-white block mt-1">Bizim Doluluk</span>
                <span className="text-[12px] font-black text-emerald-450 block">%96.8</span>
              </div>
              <div className="text-slate-650 text-[10px] font-black">VS</div>
              <div className="text-center space-y-1">
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-black uppercase">{selectedCompetitor.logo}</span>
                <span className="text-[9.5px] font-black text-white block mt-1">Rakip Doluluk</span>
                <span className="text-[12px] font-black text-slate-400 block">%{selectedCompetitor.estimatedOccupancy}</span>
              </div>
            </div>

            {/* Strengths list */}
            <div className="space-y-2">
              <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-450" />
                Rakibin Güçlü Yanları (Fırsatlarımız)
              </span>
              <div className="space-y-1">
                {selectedCompetitor.strengths.map((str, idx) => (
                  <div key={idx} className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 text-[9px] text-slate-350 font-semibold leading-relaxed">
                    {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses list */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest flex items-center gap-1">
                <XCircle size={10} className="text-rose-450" />
                Rakibin Zayıf Yanları (Avantajlarımız)
              </span>
              <div className="space-y-1">
                {selectedCompetitor.weaknesses.map((weak, idx) => (
                  <div key={idx} className="p-2 rounded bg-rose-500/5 border border-rose-500/10 text-[9px] text-slate-350 font-semibold leading-relaxed">
                    {weak}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt panel: Market charts and AI Pricing recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pazar Grafikleri list */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <PieChart size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Terminal Envanter Dağılımı</h4>
          </div>
          <div className="space-y-3">
            {[
              { type: 'LED Ekran Ağı', share: 'Biz %58 / Rakipler %42', status: 'Lider' },
              { type: 'Billboard / CLP', share: 'Biz %12 / Rakipler %88', status: 'Gelişmeli' },
              { type: 'Lightbox Pano', share: 'Biz %45 / Rakipler %55', status: 'Dengeli' }
            ].map((paz, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block">{paz.type}</span>
                  <span className="text-[7.5px] text-slate-500 block">Pazar Payı: {paz.share}</span>
                </div>
                <Badge variant={paz.status === 'Lider' ? 'success' : 'primary'}>{paz.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Fiyat Dağılımı Endeksi */}
        <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Coins size={13} />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Fiyat Karşılaştırma Matrisi</h4>
          </div>
          <div className="space-y-3">
            {[
              { area: 'Giriş LED Ekran (Günlük)', our: '₺10.000', comp: '₺14.000', trend: 'down' },
              { area: 'Check-in LED Ekran (Günlük)', our: '₺12.000', comp: '₺11.500', trend: 'up' },
              { area: 'Duty Free LED Ekran (Günlük)', our: '₺15.000', comp: '₺19.500', trend: 'down' }
            ].map((pr, idx) => (
              <div key={idx} className="flex justify-between items-center text-[9.5px]">
                <div className="text-left space-y-0.5">
                  <span className="text-white font-extrabold block">{pr.area}</span>
                  <span className="text-[7.5px] text-slate-500 block">Biz: {pr.our} / Rakipler: {pr.comp}</span>
                </div>
                <span className={`font-black flex items-center gap-0.5 text-[8.5px] uppercase ${
                  pr.trend === 'up' ? 'text-rose-450' : 'text-emerald-450'
                }`}>
                  {pr.trend === 'up' ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {pr.trend === 'up' ? 'Yüksek' : 'Düşük'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Fiyat Önerileri */}
        <div className="dark-glass-card border border-blue-500/10 rounded-2xl p-5 space-y-4 shadow-sm shadow-blue-500/5">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-400">
            <Sparkles size={13} className="text-blue-400 animate-pulse" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider text-blue-400">AI Fiyat Optimizasyonu</h4>
          </div>
          <div className="space-y-3">
            {[
              { query: 'Stroer Kentvizyon fiyat artışına paralel olarak SG-001 kiralama bedelini %12 artırın.', rate: 'Öneri' },
              { query: 'Duty Free alanında rakiplerin boşluk oranı yüksek, acil esnek indirim tanımlayın.', rate: 'Aksiyon' },
              { query: 'Turkcell yenileme teklifinde pazar fiyatının %8 üzerinde VIP teklif sunulması uygundur.', rate: 'Onay' }
            ].map((rec, idx) => (
              <div key={idx} className="text-left space-y-1 bg-white/2 border border-white/3 p-2.5 rounded-xl text-[9.5px]">
                <p className="text-slate-305 leading-relaxed font-semibold">{rec.query}</p>
                <div className="flex justify-between items-center text-[7.5px] font-black uppercase text-blue-400 pt-0.5">
                  <span>Pazar Karar Destek</span>
                  <span>{rec.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
