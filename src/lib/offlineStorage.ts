interface CachedData<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const offlineStorage = {
  set: <T>(key: string, data: T): void => {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cached));
  },

  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const cached: CachedData<T> = JSON.parse(item);
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cached.data;
    } catch {
      return null;
    }
  },

  clear: (key: string): void => {
    localStorage.removeItem(key);
  },
};
