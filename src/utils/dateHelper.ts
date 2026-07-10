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
