"use client";

import React, { useState } from "react";

interface SkeletonImageProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export function SkeletonImage({ src, alt, className = "", width, height, imageProps }: SkeletonImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!src) {
    return (
      <div 
        className={`bg-[#F5F5F7] animate-pulse rounded-md flex items-center justify-center ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
      >
        <div className="w-10 h-10 border-2 border-dashed border-stone-200 rounded-full opacity-30" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#F5F5F7] animate-pulse z-10" />
      )}
      <img
        {...imageProps}
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className} ${imageProps?.className || ''}`}
        onLoad={(e) => {
          setIsLoading(false);
          imageProps?.onLoad?.(e);
        }}
        loading="lazy"
      />
    </div>
  );
}
