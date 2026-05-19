"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageZoomLensProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageZoomLens({
  src,
  alt = "image",
  width = 40,
  height = 40,
  className = "rounded-lg object-cover border border-gray-100"
}: ImageZoomLensProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate preview popover position relative to mouse cursor
    const offset = 15; // px from cursor
    setCoords({
      x: e.clientX + offset,
      y: e.clientY + offset
    });
  };

  return (
    <div 
      className="relative inline-block cursor-zoom-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Small Thumbnail */}
      <div className="relative overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-md rounded-lg">
        <Image 
          src={src} 
          alt={alt} 
          width={width} 
          height={height} 
          className={className}
        />
      </div>

      {/* Floating Preview Popover (Rendered in Portal or Absolute Fixed position) */}
      {isHovered && (
        <div 
          className="fixed z-50 pointer-events-none p-2 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl animate-fade-in scale-in"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: "translate(0, 0)",
            maxWidth: "320px",
            maxHeight: "320px",
          }}
        >
          <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white">
            <Image 
              src={src} 
              alt={`${alt} zoom`} 
              width={220} 
              height={220} 
              className="object-cover w-52 h-52 transition-transform duration-300"
              unoptimized
            />
            {alt && (
              <div className="bg-gray-950/70 text-white text-xs font-semibold px-3 py-1.5 absolute bottom-0 left-0 right-0 text-center truncate backdrop-blur-xs">
                {alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
