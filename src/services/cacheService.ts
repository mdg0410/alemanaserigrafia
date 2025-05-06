interface CacheOptions {
  ttl?: number; // Time to live en milisegundos
  maxSize?: number; // Tamaño máximo del caché en bytes
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { value: any; timestamp: number; size: number; ttl: number }>;
  private totalSize: number;
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  private constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.totalSize = 0;
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB por defecto
    this.defaultTTL = options.ttl || 30 * 60 * 1000; // 30 minutos por defecto
  }

  public static getInstance(options?: CacheOptions): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(options);
    }
    return CacheService.instance;
  }

  private calculateSize(value: any): number {
    try {
      const str = JSON.stringify(value);
      return new Blob([str]).size;
    } catch {
      return 0;
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.cache.entries()) {
      if (now - data.timestamp > data.ttl) {
        this.totalSize -= data.size;
        this.cache.delete(key);
      }
    }
  }

  public async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    this.cleanup();

    const size = this.calculateSize(value);
    
    // Si el nuevo elemento excede el tamaño máximo, no guardarlo
    if (size > this.maxSize) {
      console.warn(`El elemento ${key} excede el tamaño máximo permitido`);
      return;
    }

    // Liberar espacio si es necesario
    while (this.totalSize + size > this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      const oldData = this.cache.get(oldestKey);
      if (oldData) {
        this.totalSize -= oldData.size;
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      size,
      ttl
    });
    this.totalSize += size;
  }

  public async get<T>(key: string): Promise<T | null> {
    this.cleanup();
    const data = this.cache.get(key);
    
    if (!data) return null;
    
    const now = Date.now();
    if (now - data.timestamp > data.ttl) {
      this.totalSize -= data.size;
      this.cache.delete(key);
      return null;
    }

    return data.value as T;
  }

  public async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await fetcher();
    await this.set(key, value, ttl);
    return value;
  }

  public clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }

  public getCacheSize(): number {
    return this.totalSize;
  }

  public getCacheUsage(): { size: number; items: number } {
    return {
      size: this.totalSize,
      items: this.cache.size
    };
  }
}

export default CacheService;