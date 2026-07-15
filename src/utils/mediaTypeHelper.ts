import { AdvertisingSpace } from '@/data/advertisingSpaces';

/**
 * Normalizes any variation of media type to a standard category.
 * Backward compatible with existing records.
 */
export function normalizeMediaType(value: string | undefined): string {
  if (!value) return 'OTHER';
  const val = value.trim().toLowerCase();

  // LED variations
  if (
    val === 'led' || 
    val === 'led screen' || 
    val === 'led_screen' || 
    val === 'digital led' ||
    val === 'led ekran' ||
    val === 'led_ekran' ||
    val === 'digital_led'
  ) {
    return 'LED';
  }

  // Lightbox variations
  if (val === 'light box' || val === 'lightbox') {
    return 'LIGHTBOX';
  }

  // Duratrans variations
  if (val === 'duratrans') {
    return 'DURATRANS';
  }

  // Megalight variations
  if (val === 'mega light' || val === 'megalight') {
    return 'MEGALIGHT';
  }

  // Foil/Vinyl variations
  if (val === 'folyo' || val === 'foil' || val === 'vinyl') {
    return 'FOIL';
  }

  // Static Panel variations
  if (
    val === 'static' || 
    val === 'panel' || 
    val === 'static_panel' || 
    val === 'static panel' ||
    val === 'statik' ||
    val === 'statik panel' ||
    val === 'statik pano' ||
    val === 'pano'
  ) {
    return 'STATIC_PANEL';
  }

  // Stand/Popup variations
  if (
    val === 'stand' || 
    val === 'popup' || 
    val === 'experience_area' || 
    val === 'experience area' ||
    val === 'deneyim alanı' ||
    val === 'deneyim alani'
  ) {
    return 'STAND';
  }

  // Sponsorship variations
  if (
    val === 'sponsorship' || 
    val === 'alan sponsorluğu' || 
    val === 'alan sponsorlugu' ||
    val === 'area_sponsorship' || 
    val === 'area sponsorship' ||
    val === 'sponsorluk' ||
    val === 'sponsorluk alanı'
  ) {
    return 'SPONSORSHIP';
  }

  return 'OTHER';
}

/**
 * Calculates dynamic count and face fields based on space name, location, or direction.
 */
export function getSpaceAdetAndFace(space: AdvertisingSpace): { adet: number; face: number } {
  // If it's an imported space (individual physical unit record)
  if (space.source === 'excel_import' || space.unitIndex !== undefined || space.importFingerprint !== undefined) {
    return {
      adet: 1,
      face: space.faceCount !== undefined && space.faceCount !== null ? space.faceCount : 1
    };
  }

  let adet = 1;
  let face = 1;

  // Face calculation: if double-sided, face is 2
  const nameLower = (space.name || '').toLowerCase();
  const locLower = (space.location || '').toLowerCase();
  const dirLower = (space.direction || '').toLowerCase();
  const noteLower = (space.notes || '').toLowerCase();

  if (
    dirLower.includes('çift') || 
    dirLower.includes('double') || 
    nameLower.includes('çift') || 
    locLower.includes('çift') || 
    noteLower.includes('çift')
  ) {
    face = 2;
  }

  // Adet calculation: look for "X adet" or similar patterns in name/notes, or specific counts
  // Default to traffic/screen fields if relevant, or try to parse
  const countMatch = nameLower.match(/(\d+)\s*adet/) || noteLower.match(/(\d+)\s*adet/);
  if (countMatch && countMatch[1]) {
    adet = parseInt(countMatch[1], 10);
  }

  // Special cases or digital screens quantity mapping
  if (space.type?.toLowerCase().includes('led') && space.name?.toLowerCase().includes('network')) {
    // If it's a network space, maybe it represents multiple screens
    // But default is 1 if not specified
  }

  return { adet, face };
}

/**
 * Checks if a space matches the specific filter criteria for a subpage or category.
 */
export function isSpaceInFilter(space: AdvertisingSpace, filterTypes: string[] | undefined): boolean {
  if (!filterTypes || filterTypes.length === 0) return true;

  const normalized = normalizeMediaType(space.type);
  const typeLower = (space.type || '').trim().toLowerCase();

  return filterTypes.some(filter => {
    const fLower = filter.toLowerCase();

    // Exact match of normalized type
    if (normalized.toLowerCase() === fLower) {
      return true;
    }

    // Custom filtering rules specified in task instructions
    if (fLower === 'digital' || fLower === 'digital_screen' || fLower === 'digital_network') {
      return (
        typeLower.includes('digital') || 
        typeLower.includes('dijital') || 
        normalized === 'LED'
      );
    }

    if (fLower === 'led_screen' || fLower === 'digital_led') {
      return normalized === 'LED';
    }

    if (fLower === 'folyo') {
      return typeLower === 'folyo' || normalized === 'FOIL';
    }

    if (fLower === 'static') {
      return normalized === 'STATIC_PANEL' || typeLower === 'static';
    }

    if (fLower === 'panel') {
      return normalized === 'STATIC_PANEL' || typeLower === 'panel';
    }

    if (fLower === 'popup' || fLower === 'experience_area') {
      return normalized === 'STAND' || typeLower.includes('popup') || typeLower.includes('experience');
    }

    if (fLower === 'area_sponsorship') {
      return normalized === 'SPONSORSHIP';
    }

    // Fallback simple comparison
    return typeLower === fLower;
  });
}
