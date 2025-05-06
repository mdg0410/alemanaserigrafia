import { useEffect, useState } from 'react';

interface ResourceOptions {
  timeout?: number;
  retries?: number;
}

export const useResourceLoader = <T>(
  loader: () => Promise<T>,
  options: ResourceOptions = {}
) => {
  const { timeout = 5000, retries = 2 } = options;
  const [resource, setResource] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let attempts = 0;

    const loadResource = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Tiempo de espera agotado')), timeout);
        });

        const resourcePromise = loader();
        const result = await Promise.race([resourcePromise, timeoutPromise]);
        setResource(result as T);
        setIsLoading(false);
      } catch (err) {
        if (attempts < retries) {
          attempts++;
          await loadResource();
        } else {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    loadResource();

    return () => {
      controller.abort();
    };
  }, [loader, timeout, retries]);

  return { resource, error, isLoading };
};

export const preloadResource = async (path: string): Promise<void> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    if (!response.ok) throw new Error('Error al precargar el recurso');

    if (path.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
      const img = new Image();
      img.src = path;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    }
  } catch (error) {
    console.warn(`Error al precargar ${path}:`, error);
  }
};

export const getResourceSize = async (path: string): Promise<number> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    if (!response.ok) throw new Error('Error al obtener el tamaño del recurso');
    return parseInt(response.headers.get('content-length') || '0', 10);
  } catch (error) {
    console.warn(`Error al obtener el tamaño de ${path}:`, error);
    return 0;
  }
};

export const optimizeImageSrc = (src: string, width: number, quality = 80): string => {
  if (!src) return '';
  
  // Si es una URL externa, retornar como está
  if (src.startsWith('http')) return src;

  // Construir URL con parámetros de optimización para imágenes locales
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    format: 'webp'
  });

  return `${src}?${params.toString()}`;
};