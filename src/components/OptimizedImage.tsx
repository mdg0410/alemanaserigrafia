import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImageSrc } from '../utils/dynamicResource';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  priority?: boolean;
  blur?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80,
  priority = false,
  blur = true
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority && src) {
      const img = new Image();
      img.src = optimizeImageSrc(src, width || 0, quality);
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, priority, width, quality]);

  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = optimizeImageSrc(src, width || 0, quality);
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [src, priority, width, quality]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <AnimatePresence>
        {!isLoaded && blur && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 animate-pulse"
            style={{ backdropFilter: 'blur(10px)' }}
          />
        )}
      </AnimatePresence>

      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
          Error al cargar la imagen
        </div>
      ) : (
        <motion.img
          ref={imgRef}
          src={priority ? optimizeImageSrc(src, width || 0, quality) : ''}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;