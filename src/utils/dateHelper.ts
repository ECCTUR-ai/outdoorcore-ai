/**
 * Safely parses multiple date formats: DD.MM.YYYY, YYYY-MM-DD, or ISO datetime string.
 * Returns null if invalid or warns in development/client environments.
 */
export const parseAnyDate = (str?: string): Date | null => {
  if (!str) return null;
  const trimmed = str.trim();
  if (!trimmed) return null;

  // 1. Check DD.MM.YYYY format
  const ddmm = trimmed.split('.');
  if (ddmm.length === 3) {
    const day = parseInt(ddmm[0], 10);
    const month = parseInt(ddmm[1], 10) - 1;
    const year = parseInt(ddmm[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // 2. Try native Date parsing (supports YYYY-MM-DD, ISO, etc.)
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d;
  }

  console.warn(`[dateHelper] Invalid date format detected: "${str}"`);
  return null;
};

export const parseDDMMYYYY = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const partsDash = dateStr.split('-');
  if (partsDash.length === 3) {
    const year = parseInt(partsDash[0], 10);
    const month = parseInt(partsDash[1], 10) - 1;
    const day = parseInt(partsDash[2], 10);
    return new Date(year, month, day);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export const formatAnyDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = parseDDMMYYYY(dateStr);
  if (!d) return dateStr;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const calculateCampaignDays = (startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): number => {
  if (!startDate || !endDate) return 0;
  const start = typeof startDate === 'string' ? parseAnyDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseAnyDate(endDate) : endDate;
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const startZero = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endZero = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  if (endZero < startZero) return 0;
  const diffTime = endZero.getTime() - startZero.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateSpaceOccupancy = (
  reservations: any[],
  spaceId: string,
  spaceCode: string,
  isDigital: boolean,
  networkCapacity: number,
  periodDays: number
): number => {
  const today = new Date();
  const startPeriod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endPeriod = new Date(startPeriod.getTime() + periodDays * 24 * 60 * 60 * 1000);

  let reservedUnitsDays = 0;

  for (const r of reservations) {
    const status = (r.status || '').toUpperCase();
    const isCancelledOrMuted = status === 'CANCELLED' || status === 'İPTAL' || status === 'TAMAMLANDI' || status === 'OPTION_EXPIRED' || status === 'DRAFT';
    if (isCancelledOrMuted) continue;

    const matchSpace = (r.spaceId && r.spaceId === spaceId) || (r.spaceCode && r.spaceCode === spaceCode);
    if (matchSpace) {
      const startB = r.startDate ? (typeof r.startDate === 'string' ? parseAnyDate(r.startDate) : r.startDate) : null;
      const endB = r.endDate ? (typeof r.endDate === 'string' ? parseAnyDate(r.endDate) : r.endDate) : null;
      if (startB && endB) {
        const startBZero = new Date(startB.getFullYear(), startB.getMonth(), startB.getDate());
        const endBZero = new Date(endB.getFullYear(), endB.getMonth(), endB.getDate());
        const intersectStart = new Date(Math.max(startPeriod.getTime(), startBZero.getTime()));
        const intersectEnd = new Date(Math.min(endPeriod.getTime(), endBZero.getTime()));
        
        if (intersectStart < intersectEnd) {
          const overlapDays = Math.round((intersectEnd.getTime() - intersectStart.getTime()) / (1000 * 60 * 60 * 24));
          if (isDigital) {
            const count = r.reservedNetworkCount || 1;
            reservedUnitsDays += count * overlapDays;
          } else {
            reservedUnitsDays += overlapDays;
          }
        }
      }
    }
  }

  if (isDigital) {
    const totalCap = (networkCapacity || 6) * periodDays;
    if (totalCap <= 0) return 0;
    return Math.min(100, Math.round((reservedUnitsDays / totalCap) * 100));
  } else {
    if (periodDays <= 0) return 0;
    return Math.min(100, Math.round((reservedUnitsDays / periodDays) * 100));
  }
};

