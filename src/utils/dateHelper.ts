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
