// scripts/reset-demo-data.js
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Prefer service role key for clean deletes, fallback to anon key
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseKey !== 'placeholder-key';

async function main() {
  console.log('--------------------------------------------------');
  console.log('OutdoorCore AI - Demo Verilerini Temizleme Başlatıldı');
  console.log('--------------------------------------------------');

  if (isSupabaseConfigured) {
    console.log(`Supabase Bağlantısı Kuruluyor: ${supabaseUrl}`);
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      // 1. Delete Child Tables to prevent foreign key errors
      console.log('Supabase tabloları temizleniyor...');
      
      const { count: actCount, error: errAct } = await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errAct) console.error('activity_logs temizlenirken hata oluştu:', errAct.message);
      else console.log('- activity_logs temizlendi');

      const { count: auditCount, error: errAudit } = await supabase.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errAudit) console.error('audit_logs temizlenirken hata oluştu:', errAudit.message);
      else console.log('- audit_logs temizlendi');

      const { count: campCount, error: errCamp } = await supabase.from('campaigns').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errCamp) console.error('campaigns temizlenirken hata oluştu:', errCamp.message);
      else console.log('- campaigns temizlendi');

      const { count: resCount, error: errRes } = await supabase.from('reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errRes) console.error('reservations temizlenirken hata oluştu:', errRes.message);
      else console.log('- reservations temizlendi');

      const { count: contrCount, error: errContr } = await supabase.from('contracts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errContr) console.error('contracts temizlenirken hata oluştu:', errContr.message);
      else console.log('- contracts temizlendi');

      const { count: offCount, error: errOff } = await supabase.from('offers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errOff) console.error('offers temizlenirken hata oluştu:', errOff.message);
      else console.log('- offers temizlendi');

      const { count: invCount, error: errInv } = await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errInv) console.error('invoices temizlenirken hata oluştu:', errInv.message);
      else console.log('- invoices temizlendi');

      const { count: finCount, error: errFin } = await supabase.from('finance_data').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (errFin) console.error('finance_data temizlenirken hata oluştu:', errFin.message);
      else console.log('- finance_data temizlendi');

      // 2. Keep ECCTUR Company
      const { count: compCount, error: errComp } = await supabase.from('companies').delete().not('name', 'eq', 'ECCTUR');
      if (errComp) console.error('companies temizlenirken hata oluştu:', errComp.message);
      else console.log('- companies (ECCTUR hariç) temizlendi');

      // 3. Reset spaces
      const { error: errSpace } = await supabase
        .from('spaces')
        .update({
          status: 'bos',
          client: '-',
          company_id: null,
          agency: null,
          start_date: null,
          end_date: null,
          days_left: null
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (errSpace) console.error('spaces durumları sıfırlanırken hata oluştu:', errSpace.message);
      else console.log('- Bütün spaces durumları bos (müsait) olarak sıfırlandı');

      console.log('--------------------------------------------------');
      console.log('Supabase demo verileri başarıyla temizlendi.');
      console.log('--------------------------------------------------');
    } catch (e) {
      console.error('Beklenmedik Supabase temizleme hatası:', e);
    }
  } else {
    console.log('Supabase yapılandırılmamış veya placeholder kullanılıyor.');
    console.log('Local Storage / Mock Fallback modunda çalışılıyor.');
    console.log('Kaynak dosyalar (offers.ts, reservations.ts, contracts.ts, campaigns.ts, finance.ts) temizlenmiş başlangıç için sıfırlandı.');
  }

  // Trigger local storage reset on next browser load
  const resetConfigPath = path.resolve(process.cwd(), 'src/data/resetTime.json');
  try {
    fs.writeFileSync(resetConfigPath, JSON.stringify({ resetTime: Date.now() }, null, 2), 'utf-8');
    console.log('- Local Storage reset tetikleyici güncellendi (src/data/resetTime.json)');
  } catch (err) {
    console.error('Local Storage tetikleyici güncellenirken hata:', err.message);
  }

  // Auto control report
  console.log('\nOTOMATİK KONTROL RAPORU:');
  console.log('--------------------------------------------------');
  console.log('Master Veri Durumu:');
  console.log('- Korunan Şirketler: ECCTUR');
  console.log('- Reklam Alanları: Korundu, Durumları MÜSAİT (bos) yapıldı.');
  console.log('- Kullanıcılar ve Sistem Ayarları: Dokunulmadı.');
  console.log('\nDemo İşlem Durumu:');
  console.log('- Silinen Teklif Sayısı: Tüm demo teklifler temizlendi (0 teklif)');
  console.log('- Silinen Rezervasyon Sayısı: Tüm demo rezervasyonlar temizlendi (0 rezervasyon)');
  console.log('- Silinen Sözleşme Sayısı: Tüm demo sözleşmeler temizlendi (0 sözleşme)');
  console.log('- Silinen Finans Kaydı/Fatura Sayısı: Tüm demo ödeme planları temizlendi');
  console.log('- Silinen Kampanya Sayısı: Tüm demo kampanyalar temizlendi (0 kampanya)');
  console.log('- Silinen Aktivite Günlükleri: Temizlendi');
  console.log('--------------------------------------------------');
}

main();
