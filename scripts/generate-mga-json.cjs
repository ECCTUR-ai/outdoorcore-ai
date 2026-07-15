/**
 * scripts/generate-mga-json.cjs
 *
 * One-time script: Reads MGA REKLAM ALANLARI.xlsx from project root,
 * generates src/data/mgaSpaces.ts as a static TypeScript data file.
 *
 * Run with: node scripts/generate-mga-json.cjs
 *
 * === NETWORK / PLAYLIST SLOT KURALLAR ===
 *
 * Network Adedi dolu olan satırlar için:
 *   - physicalUnitCount = Adet      (gerçek fiziksel ekran/ünite sayısı)
 *   - totalFaceCount    = Face adet  (toplam yüz sayısı)
 *   - slotCount         = Network Adedi (satılabilir playlist slotu)
 *
 * Bu satırlar için slotCount adet SLOT kaydı üretilir (Adet adet değil).
 * Her slot kaydı:
 *   - salesModel      = 'playlist_slot'
 *   - slotIndex       = 1..slotCount
 *   - physicalUnitCount, totalFaceCount taşır
 *   - screenSlotCapacity = totalFaceCount × slotCount
 *
 * Network Adedi boş veya 0 olan satırlar için:
 *   - salesModel = 'physical_unit'
 *   - Adet adet fiziksel kayıt üretilir (mevcut davranış)
 *
 * Statik + Network Adedi bulunan satırlar:
 *   - networkInterpretationStatus = 'needs_review'
 *   - salesModel = 'physical_unit' (slot üretilmez)
 */

const fs   = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// ── Turkish character normalizer ──────────────────────────────────────────────
function normalizeString(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

// ── Network Adedi parser — handles "6 NETWORK", "2 Network", "4", "  6  " ─────
function parseNetworkCount(raw) {
  if (!raw && raw !== 0) return 0;
  const str = String(raw).trim();
  if (!str) return 0;
  // Extract leading integer from any format
  const match = str.match(/^(\d+)/);
  if (!match) return 0;
  const n = parseInt(match[1], 10);
  return isNaN(n) || n <= 0 ? 0 : n;
}

// ── Column header mapper ──────────────────────────────────────────────────────
function normalizeHeaders(headers) {
  const mapping = {};
  headers.forEach((h) => {
    const norm = normalizeString(h);
    if (norm === 'sirano' || (norm.startsWith('sira') && norm.length <= 6)) {
      mapping.sequenceNo = h;
    } else if (norm.startsWith('slayt')) {
      mapping.slideNo = h;
    } else if (norm.includes('reklamalaniadi') || norm === 'reklamalani' || norm === 'adi' || norm === 'ad') {
      mapping.name = h;
    } else if (norm === 'terminal' || norm.includes('bolge')) {
      mapping.terminal = h;
    } else if (norm === 'olcu' || norm === 'ebat' || norm.includes('boyut')) {
      mapping.dimensions = h;
    } else if (norm === 'adet') {
      mapping.quantity = h;
    } else if (norm === 'faceadet' || norm === 'face') {
      mapping.faceCount = h;
    } else if (norm.includes('ekranturu')) {
      mapping.screenType = h;
    } else if (norm.startsWith('network')) {
      mapping.networkCount = h;
    } else if (norm === 'not' || norm.includes('aciklama')) {
      mapping.notes = h;
    }
  });
  return mapping;
}

// ── Media classification ──────────────────────────────────────────────────────
function classifyMedia(name, screenType) {
  const stLower = String(screenType || '').toLowerCase().trim();
  const nameLower = String(name || '').toLowerCase().trim();

  let exactType = 'Other';
  if (stLower.includes('led') || stLower.includes('dijital') || stLower.includes('digital')) {
    exactType = 'LED';
  } else if (stLower.includes('lightbox')) {
    exactType = 'Lightbox';
  } else if (stLower.includes('duratrans')) {
    exactType = 'Duratrans';
  } else if (stLower.includes('megalight')) {
    exactType = 'Megalight';
  } else if (stLower.includes('folyo')) {
    exactType = 'Foil';
  } else if (stLower.includes('statik')) {
    exactType = 'Static Panel';
  } else if (stLower.includes('stand')) {
    exactType = 'Stand';
  } else if (stLower.includes('sponsor')) {
    exactType = 'Sponsorship';
  } else {
    // Fallback to name keywords
    if (nameLower.includes('led') || nameLower.includes('dijital')) exactType = 'LED';
    else if (nameLower.includes('lightbox')) exactType = 'Lightbox';
    else if (nameLower.includes('duratrans')) exactType = 'Duratrans';
    else if (nameLower.includes('megalight')) exactType = 'Megalight';
    else if (nameLower.includes('folyo')) exactType = 'Foil';
    else if (nameLower.includes('pano') || nameLower.includes('statik')) exactType = 'Static Panel';
    else if (nameLower.includes('stand')) exactType = 'Stand';
    else if (nameLower.includes('sponsor')) exactType = 'Sponsorship';
  }

  const isDigital = (exactType === 'LED');
  const isStatic = ['Lightbox', 'Duratrans', 'Megalight', 'Foil', 'Static Panel'].includes(exactType);
  const isSpecial = ['Stand', 'Sponsorship'].includes(exactType);

  return {
    isDigital,
    isStatic,
    isSpecial,
    typeLabel: isDigital ? 'Dijital' : (isStatic ? 'Statik' : 'Özel'),
    spaceType: exactType,
  };
}

// ── Deterministic fingerprint ─────────────────────────────────────────────────
function generateFingerprint(row, unitIndex) {
  const key = [
    normalizeString(row.name),
    normalizeString(row.terminal),
    normalizeString(row.dimensions),
    normalizeString(row.screenType),
    String(row.slideNo || ''),
    String(row.sequenceNo || ''),
    String(row.quantity || ''),
    String(row.networkCount || ''),
    unitIndex,
  ].join('|');

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return `MGA-FP-${Math.abs(hash).toString(16).toUpperCase()}-${unitIndex}`;
}

// ── Parse dimensions ──────────────────────────────────────────────────────────
function parseDimensions(dimStr) {
  if (!dimStr || dimStr === '-') return { width: null, height: null, unit: '' };
  const clean = String(dimStr).toLowerCase().trim();
  if (clean.includes('"') || clean.includes('inch')) {
    const val = parseFloat(clean);
    return { width: isNaN(val) ? null : val, height: null, unit: 'inch' };
  }
  const match = clean.match(/([\d,.]+)\s*[*x×]\s*([\d,.]+)/);
  if (match) {
    return {
      width:  parseFloat(match[1].replace(',', '.')) || null,
      height: parseFloat(match[2].replace(',', '.')) || null,
      unit:   clean.includes('m') && !clean.includes('cm') ? 'm' : 'cm',
    };
  }
  return { width: null, height: null, unit: '' };
}

// ── Main ──────────────────────────────────────────────────────────────────────
let EXCEL_PATH   = path.join(__dirname, '..', 'MGA REKLAM ALANLARI.xlsx');
const OUT_PATH   = path.join(__dirname, '..', 'src', 'data', 'mgaSpaces.ts');

if (!fs.existsSync(EXCEL_PATH)) {
  const altPath = path.join(__dirname, '..', 'private-imports', 'MGA REKLAM ALANLARI.xlsx');
  if (!fs.existsSync(altPath)) {
    console.error(`ERROR: Excel file not found at:\n  ${EXCEL_PATH}\n  ${altPath}`);
    process.exit(1);
  }
  console.log(`Using private-imports fallback: ${altPath}`);
  EXCEL_PATH = altPath;
}

console.log(`\nReading: ${EXCEL_PATH}`);
const buffer   = fs.readFileSync(EXCEL_PATH);
const workbook = XLSX.read(buffer, { type: 'buffer' });
const sheet    = workbook.Sheets[workbook.SheetNames[0]];
const rawRows  = XLSX.utils.sheet_to_json(sheet, { defval: '' });

if (rawRows.length === 0) {
  console.error('ERROR: Excel has no data rows.');
  process.exit(1);
}

const headers = Object.keys(rawRows[0]);
const mapping = normalizeHeaders(headers);

console.log('Detected column mapping:', mapping);

if (!mapping.name) {
  console.error('ERROR: Could not detect the "Reklam Alanı Adı" column.');
  console.error('Available headers:', headers);
  process.exit(1);
}

const spaces = [];
let currentSeq = 0;
let invalidRows = 0;
let skippedDups = 0;
const fingerprintSet = new Set();

// ── Network audit tracking ─────────────────────────────────────────────────
const networkAudit = [];
const networkDistribution = {};

const stats = {
  sourceRows:              rawRows.length,
  validRows:               0,
  invalidRows:             0,
  totalPhysicalUnits:      0, // sum of Adet for non-network rows
  totalNetworkGroups:      0, // rows with valid network count
  totalPlaylistSlots:      0, // sum of slot records created
  totalFaceSlotCapacity:   0, // sum of (Face × slotCount)
  physicalUnitRecords:     0, // actual MGA records for physical_unit
  playlistSlotRecords:     0, // actual MGA records for playlist_slot
  needsReviewRows:         0,
  totalMgaRecords:         0,
  digital:                 0,
  static:                  0,
  other:                   0,
};

rawRows.forEach((row, idx) => {
  const name       = String(row[mapping.name] || '').trim();
  const terminal   = String(row[mapping.terminal] || '').trim();
  const dimensions = String(row[mapping.dimensions] || '').trim();
  const screenType = String(row[mapping.screenType] || '').trim();
  const networkRaw = String(row[mapping.networkCount] || '').trim();
  const notes      = String(row[mapping.notes] || '').trim();
  const qtyRaw     = row[mapping.quantity];
  const faceRaw    = row[mapping.faceCount];
  const slideNo    = row[mapping.slideNo] || '';
  const sequenceNo = row[mapping.sequenceNo] || '';

  if (!name) { invalidRows++; stats.invalidRows++; return; }

  // ── Core counts ─────────────────────────────────────────────────────────
  let physicalUnitCount = parseInt(qtyRaw, 10);
  if (isNaN(physicalUnitCount) || physicalUnitCount <= 0) {
    const face = parseInt(faceRaw, 10);
    physicalUnitCount = (!isNaN(face) && face > 0) ? face : 1;
  }
  const totalFaceCount = parseInt(faceRaw, 10) || physicalUnitCount;

  // ── Network parse ────────────────────────────────────────────────────────
  const networkCount = parseNetworkCount(networkRaw);

  // ── Media classification ─────────────────────────────────────────────────
  const cls = classifyMedia(name, screenType);
  const parsedDim = parseDimensions(dimensions);
  const groupId = `GRP-${String(idx + 1).padStart(3, '0')}`;
  const fpKey   = { name, terminal, dimensions, screenType, slideNo, sequenceNo,
                    quantity: physicalUnitCount, networkCount: networkRaw };

  stats.validRows++;

  // ── Determine sales model ────────────────────────────────────────────────
  let salesModel = 'physical_unit';
  let networkInterpretationStatus = null;
  let slotCount = 0;
  let screenSlotCapacity = 0;

  if (networkCount > 0) {
    stats.totalNetworkGroups++;

    // Track distribution
    const key = String(networkCount);
    networkDistribution[key] = (networkDistribution[key] || 0) + 1;

    if (cls.isStatic) {
      networkInterpretationStatus = 'needs_review';
      stats.needsReviewRows++;
      console.warn(`  ⚠ NEEDS_REVIEW Row ${idx + 2}: "${name}" — STATIC media with Network Adedi="${networkRaw}"`);
    }

    networkAudit.push({
      rowNum: idx + 2,
      name,
      screenType,
      isDigital: cls.isDigital,
      isStatic: cls.isStatic,
      adet: physicalUnitCount,
      faceAdet: totalFaceCount,
      networkRaw,
      networkCount,
      salesModel: 'physical_unit',
      slotCount: 0,
      screenSlotCapacity: 0,
      networkInterpretationStatus: networkInterpretationStatus || 'ok',
    });
  }

  // ── How many records to create ───────────────────────────────────────────
  // Under the new model, we always generate physicalUnitCount records
  const recordCount = physicalUnitCount;

  if (cls.isDigital)     stats.digital += recordCount;
  else if (cls.isStatic) stats.static  += recordCount;
  else                   stats.other   += recordCount;

  stats.physicalUnitRecords += recordCount;
  stats.totalPhysicalUnits += physicalUnitCount;

  const baseFace = Math.floor(totalFaceCount / physicalUnitCount);
  const remainder = totalFaceCount % physicalUnitCount;

  // ── Create records ───────────────────────────────────────────────────────
  for (let i = 1; i <= recordCount; i++) {
    const fp = generateFingerprint(fpKey, i);
    if (fingerprintSet.has(fp)) { skippedDups++; continue; }
    fingerprintSet.add(fp);

    currentSeq++;
    const codeNum  = String(currentSeq).padStart(6, '0');
    const idxLabel = String(i).padStart(3, '0');

    // Display name: e.g. "— 001"
    const unitLabel = `— ${idxLabel}`;
    
    // Deterministik face dağıtımı
    const faceCount = baseFace + (i <= remainder ? 1 : 0);

    spaces.push({
      id:                       `SPC-MGA${codeNum}`,
      code:                     `MGA-${codeNum}`,
      name:                     `${name} ${unitLabel}`,
      groupName:                name,
      inventoryGroupId:         groupId,
      unitIndex:                i,
      sequenceNo:               typeof sequenceNo === 'number' ? sequenceNo : (parseInt(String(sequenceNo)) || 0),
      slideNo:                  typeof slideNo    === 'number' ? slideNo    : (parseInt(String(slideNo))    || 0),
      terminal:                 terminal || 'Ortak Alan',
      location:                 terminal || 'Ortak Alan',
      dimensions,
      size:                     dimensions || 'Muhtelif',
      width:                    parsedDim.width,
      height:                   parsedDim.height,
      measurementUnit:          parsedDim.unit,

      // ── Physical / slot counts ─────────────────────────────────────────
      physicalUnitCount,        // Adet — gerçek fiziksel ekran sayısı
      totalFaceCount,           // Face adet — toplam yüz sayısı
      slotCount:                null,
      slotIndex:                null,
      screenSlotCapacity:       null,
      // Legacy compat
      faceCount,
      networkName:              networkRaw || '',
      networkCount:             networkCount,
      network_capacity:         networkCount,
      networkCapacity:          networkCount,

      screenType:               screenType || '',
      type:                     cls.spaceType,
      mediaType:                cls.typeLabel,
      notes:                    notes || '',

      // ── Sales model ────────────────────────────────────────────────────
      salesModel,               // 'physical_unit'
      networkInterpretationStatus: networkInterpretationStatus || null,

      status:                   'bos',
      salesStatus:              'available',
      isDigital:                cls.isDigital,
      isStatic:                 cls.isStatic,
      isSpecial:                cls.isSpecial,
      isActive:                 true,
      price:                    '₺0',
      priceNumeric:             0,
      dailyPrice:               0,
      monthlyPrice:             0,
      currency:                 'TRY',
      source:                   'excel_import',
      sourceFile:               'MGA REKLAM ALANLARI.xlsx',
      sourceRow:                idx + 2,
      importFingerprint:        fp,
      importBatchId:            'STATIC_JSON_v3',
      created_at:               '2026-07-15T00:00:00.000Z',
    });
  }
});

stats.totalMgaRecords = spaces.length;

// ── Console report ────────────────────────────────────────────────────────────
const firstCode = spaces.length > 0 ? spaces[0].code : 'N/A';
const lastCode  = spaces.length > 0 ? spaces[spaces.length - 1].code : 'N/A';

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('  MGA IMPORT STATISTICS');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`Excel source rows               : ${stats.sourceRows}`);
console.log(`Valid rows (groups)             : ${stats.validRows}`);
console.log(`Invalid rows (no name)          : ${stats.invalidRows}`);
console.log(`Skipped duplicates              : ${skippedDups}`);
console.log('───────────────────────────────────────────────────────────────────');
console.log(`Total physicalUnitCount (Adet Σ): ${stats.totalPhysicalUnits}`);
console.log(`Network groups detected         : ${stats.totalNetworkGroups}`);
console.log(`  needs_review (static+network) : ${stats.needsReviewRows}`);
console.log(`Total playlist slots created    : ${stats.totalPlaylistSlots}`);
console.log(`Total face-slot capacity        : ${stats.totalFaceSlotCapacity.toLocaleString('tr-TR')}`);
console.log('───────────────────────────────────────────────────────────────────');
console.log(`Physical_unit MGA records       : ${stats.physicalUnitRecords}`);
console.log(`Playlist_slot MGA records       : ${stats.playlistSlotRecords}`);
console.log(`TOTAL MGA records               : ${stats.totalMgaRecords}`);
console.log(`First MGA code                  : ${firstCode}`);
console.log(`Last  MGA code                  : ${lastCode}`);
console.log(`Unique fingerprints             : ${fingerprintSet.size}`);
console.log('───────────────────────────────────────────────────────────────────');
console.log(`Digital records                 : ${stats.digital}`);
console.log(`Static records                  : ${stats.static}`);
console.log(`Other records                   : ${stats.other}`);
console.log('───────────────────────────────────────────────────────────────────');
console.log('Network distribution:');
Object.entries(networkDistribution).sort((a,b) => parseInt(a[0])-parseInt(b[0])).forEach(([k,v]) => {
  console.log(`  ${k} Network : ${v} grup`);
});

console.log('\n── Network Audit Detail ──────────────────────────────────────────');
networkAudit.forEach(r => {
  const status = r.networkInterpretationStatus === 'needs_review' ? '⚠ NEEDS_REVIEW' : '✓';
  console.log(`  [Row ${r.rowNum}] ${status} "${r.name.substring(0,50)}"`);
  console.log(`         Adet=${r.adet}, Face=${r.faceAdet}, Network="${r.networkRaw}" → slotCount=${r.slotCount}, faceSlotCap=${r.screenSlotCapacity}`);
});
console.log('═══════════════════════════════════════════════════════════════════\n');

// ── Generate TypeScript output ────────────────────────────────────────────────
const networkAuditJson = JSON.stringify(networkAudit, null, 2);

const ts = `/**
 * src/data/mgaSpaces.ts
 *
 * AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Generated by: node scripts/generate-mga-json.cjs
 * Source file : MGA REKLAM ALANLARI.xlsx
 * Generated at: ${new Date().toISOString()}
 *
 * ═══ IMPORT STATISTICS ════════════════════════════════════════════════
 * Source rows           : ${stats.sourceRows}
 * Valid rows            : ${stats.validRows}
 * Network groups        : ${stats.totalNetworkGroups}
 * Playlist slot records : ${stats.playlistSlotRecords}
 * Physical unit records : ${stats.physicalUnitRecords}
 * Total MGA records     : ${stats.totalMgaRecords}
 * Total face-slot cap.  : ${stats.totalFaceSlotCapacity.toLocaleString('tr-TR')}
 * Needs review          : ${stats.needsReviewRows}
 * First code            : ${firstCode}
 * Last code             : ${lastCode}
 * ══════════════════════════════════════════════════════════════════════
 */

export interface MgaSpace {
  id: string;
  code: string;
  name: string;
  groupName: string;
  inventoryGroupId: string;
  unitIndex: number;
  sequenceNo: number;
  slideNo: number;
  terminal: string;
  location: string;
  dimensions: string;
  size: string;
  width: number | null;
  height: number | null;
  measurementUnit: string;

  /** Fiziksel ekran/ünite sayısı (Excel Adet kolonu) */
  physicalUnitCount: number;
  /** Toplam yüz sayısı (Excel Face adet kolonu) */
  totalFaceCount: number;
  /** Playlist slot sayısı — yalnızca salesModel='playlist_slot' olanlar için */
  slotCount: number | null;
  /** Bu kaydın slot indeksi (1..slotCount) */
  slotIndex: number | null;
  /** totalFaceCount × slotCount kapasitesi */
  screenSlotCapacity: number | null;

  // Legacy compat
  faceCount: number;
  networkName: string;
  networkCount: number;
  network_capacity?: number;
  networkCapacity?: number;

  screenType: string;
  type: string;
  mediaType: string;
  notes: string;

  /** 'playlist_slot' | 'physical_unit' */
  salesModel: string;
  /** null | 'needs_review' */
  networkInterpretationStatus: string | null;

  status: string;
  salesStatus: string;
  isDigital: boolean;
  isStatic: boolean;
  isSpecial: boolean;
  isActive: boolean;
  price: string;
  priceNumeric: number;
  dailyPrice: number;
  monthlyPrice: number;
  currency: string;
  source: string;
  sourceFile: string;
  sourceRow: number;
  importFingerprint: string;
  importBatchId: string;
  created_at: string;
}

export const mgaSpaces: MgaSpace[] = ${JSON.stringify(spaces, null, 2)};

export const mgaImportStats = {
  sourceRows:            ${stats.sourceRows},
  validRows:             ${stats.validRows},
  totalPhysicalUnits:    ${stats.totalPhysicalUnits},
  networkGroups:         ${stats.totalNetworkGroups},
  totalPlaylistSlots:    ${stats.totalPlaylistSlots},
  totalFaceSlotCapacity: ${stats.totalFaceSlotCapacity},
  playlistSlotRecords:   ${stats.playlistSlotRecords},
  physicalUnitRecords:   ${stats.physicalUnitRecords},
  totalMgaRecords:       ${stats.totalMgaRecords},
  needsReviewRows:       ${stats.needsReviewRows},
  digital:               ${stats.digital},
  staticCount:           ${stats.static},
  other:                 ${stats.other},
  firstCode:             '${firstCode}',
  lastCode:              '${lastCode}',
  generatedAt:           '${new Date().toISOString()}',
};

/** Network audit log — rows where Network Adedi was found */
export const mgaNetworkAudit = ${networkAuditJson};
`;

fs.writeFileSync(OUT_PATH, ts, 'utf-8');
console.log(`✅  Written to: ${OUT_PATH}`);
console.log(`    Total MGA records: ${spaces.length}`);
console.log(`    Playlist slots   : ${stats.playlistSlotRecords}`);
console.log(`    Physical units   : ${stats.physicalUnitRecords}`);
