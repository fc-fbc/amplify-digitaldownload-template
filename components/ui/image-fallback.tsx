"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface ImageFallbackProps extends ImageProps {
  fallbackClassName?: string;
}

/**
 * Enhanced Image component with loading state and fallback
 * Provides better handling for image loading, errors, and caching
 */
export function ImageFallback({
  src,
  alt,
  fallbackClassName,
  className,
  ...props
}: ImageFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Preload and cache the image when the component mounts
  useEffect(() => {
    if (typeof src === 'string') {
      const img = new window.Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
      
      // Add to browser cache explicitly
      if ('caches' in window) {
        try {
          caches.open('image-cache').then(cache => {
            cache.add(src);
          });
        } catch (e) {
          console.error("Error caching image:", e);
        }
      }
    }
  }, [src]);

  return (
    <div className="relative">
      {/* Show fallback while image is loading or on error */}
      {(!isLoaded || error) && (
        <div className={fallbackClassName || "w-full h-full bg-gray-200 animate-pulse rounded"}></div>
      )}
      
      {/* Only render the image if there's no error */}
      {!error && (
        <Image
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.error(`Failed to load image: ${src}`);
            setError(true);
          }}
          style={{ width: 'auto', height: 'auto' }} // Ensure aspect ratio is maintained
          {...props}
        />
      )}
      
      {/* Show alt text if there's an error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          {alt}
        </div>
      )}
    </div>
  );
}
