/**
 * scripts/generate-mga-json.cjs
 *
 * One-time script: Reads MGA REKLAM ALANLARI.xlsx from project root,
 * generates src/data/mgaSpaces.ts as a static TypeScript data file.
 *
 * Run with: node scripts/generate-mga-json.cjs
 *
 * Output: src/data/mgaSpaces.ts (bundled with app, no localStorage needed)
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// ── Turkish character normalizer ──────────────────────────────────────────────
function normalizeString(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

// ── Column header mapper ──────────────────────────────────────────────────────
function normalizeHeaders(headers) {
  const mapping = {};
  headers.forEach((h) => {
    const norm = normalizeString(h);
    if (norm === 'sirano' || norm.startsWith('sira') && norm.length <= 6) {
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
    } else if (norm === 'ekranturu' || norm.includes('ekranturu')) {
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
  const text = `${name} ${screenType}`.toLowerCase();
  const digitalKw = ['led', 'dijital', 'ekran', 'lcd', 'video wall', 'videowall', 'digital'];
  const staticKw  = ['duratrans', 'clp', 'billboard', 'raket', 'lightbox', 'pano', 'statik', 'totem'];

  let isDigital = digitalKw.some(kw => text.includes(kw));
  let isStatic  = staticKw.some(kw => text.includes(kw));

  if (isDigital && isStatic) {
    const st = screenType.toLowerCase();
    if (st.includes('led') || st.includes('digital') || st.includes('screen')) isStatic = false;
    else isDigital = false;
  }

  return {
    isDigital,
    isStatic: !isDigital && isStatic,
    typeLabel: isDigital ? 'Dijital' : (isStatic ? 'Statik' : 'Diğer'),
    spaceType: isDigital ? 'LED' : (isStatic ? 'LIGHTBOX' : 'Diğer'),
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
const EXCEL_PATH = path.join(__dirname, '..', 'MGA REKLAM ALANLARI.xlsx');
const OUT_PATH   = path.join(__dirname, '..', 'src', 'data', 'mgaSpaces.ts');

if (!fs.existsSync(EXCEL_PATH)) {
  console.error(`ERROR: Excel file not found at ${EXCEL_PATH}`);
  process.exit(1);
}

console.log(`Reading: ${EXCEL_PATH}`);
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
  console.error('ERROR: Could not detect the "Reklam Alanı Adı" column. Check header spelling.');
  console.error('Available headers:', headers);
  process.exit(1);
}

const spaces = [];
let currentSeq = 0;
let invalidRows = 0;
let skippedDups = 0;
const fingerprintSet = new Set();

const stats = {
  sourceRows: rawRows.length,
  validRows: 0,
  totalQuantity: 0,
  groups: 0,
  digital: 0,
  static: 0,
  other: 0,
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

  if (!name) { invalidRows++; return; }

  let quantity = parseInt(qtyRaw, 10);
  if (isNaN(quantity) || quantity <= 0) {
    const face = parseInt(faceRaw, 10);
    quantity = (!isNaN(face) && face > 0) ? face : 1;
  }

  stats.validRows++;
  stats.totalQuantity += quantity;
  stats.groups++;

  const cls         = classifyMedia(name, screenType);
  const parsedDim   = parseDimensions(dimensions);
  const faceCount   = parseInt(faceRaw, 10) || 1;
  const networkCount = parseInt(networkRaw, 10) || 0;

  if (cls.isDigital) stats.digital += quantity;
  else if (cls.isStatic) stats.static += quantity;
  else stats.other += quantity;

  const groupId = `GRP-${String(idx + 1).padStart(3, '0')}`;

  const fpKey = { name, terminal, dimensions, screenType, slideNo, sequenceNo, quantity, networkCount: networkRaw };

  for (let i = 1; i <= quantity; i++) {
    const fp = generateFingerprint(fpKey, i);
    if (fingerprintSet.has(fp)) { skippedDups++; continue; }
    fingerprintSet.add(fp);

    currentSeq++;
    const codeNum     = String(currentSeq).padStart(6, '0');
    const unitIdx3    = String(i).padStart(3, '0');

    spaces.push({
      id:                `SPC-MGA${codeNum}`,
      code:              `MGA-${codeNum}`,
      name:              `${name} — ${unitIdx3}`,
      groupName:         name,
      inventoryGroupId:  groupId,
      unitIndex:         i,
      sequenceNo:        typeof sequenceNo === 'number' ? sequenceNo : (parseInt(String(sequenceNo)) || 0),
      slideNo:           typeof slideNo    === 'number' ? slideNo    : (parseInt(String(slideNo))    || 0),
      terminal:          terminal || 'Ortak Alan',
      location:          terminal || 'Ortak Alan',
      dimensions,
      size:              dimensions || 'Muhtelif',
      width:             parsedDim.width,
      height:            parsedDim.height,
      measurementUnit:   parsedDim.unit,
      faceCount,
      screenType:        screenType || '',
      type:              cls.spaceType,
      mediaType:         cls.typeLabel,
      networkName:       networkRaw || '',
      networkCount,
      notes:             notes || '',
      status:            'bos',
      salesStatus:       'available',
      isDigital:         cls.isDigital,
      isStatic:          cls.isStatic,
      isActive:          true,
      price:             '₺0',
      priceNumeric:      0,
      dailyPrice:        0,
      monthlyPrice:      0,
      currency:          'TRY',
      source:            'excel_import',
      sourceFile:        'MGA REKLAM ALANLARI.xlsx',
      sourceRow:         idx + 2,
      importFingerprint: fp,
      importBatchId:     'STATIC_JSON_v1',
      created_at:        '2026-07-11T00:00:00.000Z',
    });
  }
});

const firstCode = spaces.length > 0 ? spaces[0].code : 'N/A';
const lastCode  = spaces.length > 0 ? spaces[spaces.length - 1].code : 'N/A';

console.log('\n=== IMPORT STATISTICS ===');
console.log(`Source rows        : ${stats.sourceRows}`);
console.log(`Valid rows (groups): ${stats.validRows}`);
console.log(`Invalid rows       : ${invalidRows}`);
console.log(`Total Adet (units) : ${stats.totalQuantity}`);
console.log(`Created records    : ${spaces.length}`);
console.log(`Skipped duplicates : ${skippedDups}`);
console.log(`Digital units      : ${stats.digital}`);
console.log(`Static units       : ${stats.static}`);
console.log(`Other units        : ${stats.other}`);
console.log(`First MGA code     : ${firstCode}`);
console.log(`Last MGA code      : ${lastCode}`);
console.log(`Unique fingerprints: ${fingerprintSet.size}`);
console.log('=========================\n');

// ── Generate TypeScript output ────────────────────────────────────────────────
const ts = `/**
 * src/data/mgaSpaces.ts
 *
 * AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Generated by: node scripts/generate-mga-json.cjs
 * Source file : MGA REKLAM ALANLARI.xlsx
 * Generated at: ${new Date().toISOString()}
 *
 * Import stats:
 *   Source rows   : ${stats.sourceRows}
 *   Valid rows    : ${stats.validRows}
 *   Total units   : ${spaces.length}
 *   Digital       : ${stats.digital}
 *   Static        : ${stats.static}
 *   Other         : ${stats.other}
 *   First code    : ${firstCode}
 *   Last code     : ${lastCode}
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
  faceCount: number;
  screenType: string;
  type: string;
  mediaType: string;
  networkName: string;
  networkCount: number;
  notes: string;
  status: string;
  salesStatus: string;
  isDigital: boolean;
  isStatic: boolean;
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
  sourceRows:   ${stats.sourceRows},
  validRows:    ${stats.validRows},
  totalUnits:   ${spaces.length},
  digital:      ${stats.digital},
  staticCount:  ${stats.static},
  other:        ${stats.other},
  firstCode:    '${firstCode}',
  lastCode:     '${lastCode}',
  generatedAt:  '${new Date().toISOString()}',
};
`;

fs.writeFileSync(OUT_PATH, ts, 'utf-8');
console.log(`✅  Written to: ${OUT_PATH}`);
console.log(`    Total records in file: ${spaces.length}`);
