"use client";

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface CarouselProps {
  children: ReactNode;
  className?: string;
}

export default function Carousel({ children, className = "" }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    direction: "rtl" // Since the app is in RTL
  });

  return (
    <div className="overflow-hidden w-full" ref={emblaRef} dir="rtl">
      <div className={`flex touch-pan-y ${className}`}>
        {children}
      </div>
    </div>
  );
}
