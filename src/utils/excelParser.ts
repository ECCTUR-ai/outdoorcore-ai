import * as XLSX from 'xlsx';

// Helper to normalize Turkish characters and clean strings
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
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

// Normalizes column headers to map to standard fields
export function normalizeHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  headers.forEach((h, index) => {
    const norm = normalizeString(h);
    if (norm.includes('sirano') || norm.includes('sira')) {
      mapping['sequenceNo'] = h;
    } else if (norm.includes('slaytno') || norm.includes('slayt')) {
      mapping['slideNo'] = h;
    } else if (norm.includes('reklamalaniadi') || norm.includes('reklamalani') || norm === 'ad' || norm === 'adi') {
      mapping['name'] = h;
    } else if (norm.includes('terminal') || norm.includes('bolge')) {
      mapping['terminal'] = h;
    } else if (norm.includes('olcu') || norm.includes('ebat') || norm.includes('boyut')) {
      mapping['dimensions'] = h;
    } else if (norm.includes('adet') && !norm.includes('face') && !norm.includes('network')) {
      mapping['quantity'] = h;
    } else if (norm.includes('faceadet') || norm.includes('face')) {
      mapping['faceCount'] = h;
    } else if (norm.includes('ekranturu') || norm.includes('ekran')) {
      mapping['screenType'] = h;
    } else if (norm.includes('networkadedi') || norm.includes('network')) {
      mapping['networkCount'] = h;
    } else if (norm.includes('not') || norm.includes('aciklama')) {
      mapping['notes'] = h;
    }
  });
  return mapping;
}

// Parse dimensions string like '300x200 cm' or '3 x 2 m' or '55"'
export function parseDimensions(dimStr: string) {
  if (!dimStr || dimStr === '-') {
    return { width: null, height: null, unit: '' };
  }
  
  const clean = dimStr.toLowerCase().trim();
  
  // Check if it's inches e.g. 55"
  if (clean.includes('"') || clean.includes('”') || clean.includes('inch')) {
    const val = parseFloat(clean);
    return { width: isNaN(val) ? null : val, height: null, unit: 'inch' };
  }

  // Regex to extract numbers e.g. 300x200 or 3.5 x 2.0 or 7,5m x 14m
  const match = clean.match(/([\d,.]+)\s*(\*|x|×)\s*([\d,.]+)/);
  if (match) {
    const wStr = match[1].replace(',', '.');
    const hStr = match[3].replace(',', '.');
    const width = parseFloat(wStr);
    const height = parseFloat(hStr);
    
    // Determine unit
    let unit = 'cm';
    if (clean.includes('m') && !clean.includes('cm')) {
      unit = 'm';
    }
    
    return {
      width: isNaN(width) ? null : width,
      height: isNaN(height) ? null : height,
      unit
    };
  }
  
  return { width: null, height: null, unit: '' };
}

// Classifies the media as digital, static, or other
export function classifyMedia(name: string, screenType: string): { 
  isDigital: boolean; 
  isStatic: boolean; 
  isSpecial: boolean;
  typeLabel: 'Dijital' | 'Statik' | 'Özel'; 
  spaceType: string;
} {
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

// Helper to generate deterministic fingerprint for duplicate protection
export function generateFingerprint(row: any, unitIndex: number): string {
  const name = normalizeString(row.name || '');
  const term = normalizeString(row.terminal || '');
  const dim = normalizeString(row.dimensions || '');
  const scr = normalizeString(row.screenType || '');
  const slide = String(row.slideNo || '');
  const seq = String(row.sequenceNo || '');
  const qty = String(row.quantity || '');
  const net = String(row.networkCount || '');
  
  const key = `${name}|${term}|${dim}|${scr}|${slide}|${seq}|${qty}|${net}|${unitIndex}`;
  
  // Simple hash function to generate short hash representation
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  return `MGA-FP-${Math.abs(hash).toString(16).toUpperCase()}-${unitIndex}`;
}
