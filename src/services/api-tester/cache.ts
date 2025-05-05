
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly defaultTtl: number;
  
  constructor(defaultTtl: number = 60 * 1000) { // Default TTL: 1 minute
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
  }

  /**
   * Set a cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Get a cache entry if it exists and is not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Check if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove a key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new ApiCache();
export default apiCache;
