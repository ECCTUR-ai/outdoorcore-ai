const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes inactivity timeout

export const sessionManager = {
  setLastActivity(): void {
    try {
      localStorage.setItem('outdoorcore_last_activity', Date.now().toString());
    } catch {
      // Ignore
    }
  },

  isExpired(): boolean {
    try {
      const lastActivity = localStorage.getItem('outdoorcore_last_activity');
      if (!lastActivity) return false;
      const parsed = parseInt(lastActivity, 10);
      if (isNaN(parsed)) return false;
      return Date.now() - parsed > SESSION_EXPIRY_MS;
    } catch {
      return false;
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem('outdoorcore_last_activity');
    } catch {
      // Ignore
    }
  }
};
