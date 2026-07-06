const REMEMBER_ME_KEY = 'outdoorcore_remember_me';

export const rememberMe = {
  getCredentials(): { email: string } | null {
    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  },

  saveCredentials(email: string): void {
    try {
      localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({ email }));
    } catch {
      // Ignore
    }
  },

  clearCredentials(): void {
    try {
      localStorage.removeItem(REMEMBER_ME_KEY);
    } catch {
      // Ignore
    }
  }
};
