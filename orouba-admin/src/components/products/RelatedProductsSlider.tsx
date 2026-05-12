"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  images: { url: string }[];
}

interface RelatedProductsSliderProps {
  products: Product[];
  brand: {
    id: string;
    hoverColor?: string | null;
  };
  locale: "ar" | "en";
  textColor?: string;
}

export default function RelatedProductsSlider({ products, brand, locale, textColor = "#004A99" }: RelatedProductsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Approximately one card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full mt-16 mb-24 relative z-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mb-8 text-center md:text-start">
        <h2 className="text-3xl md:text-4xl font-black drop-shadow-sm" style={{ color: textColor }}>
          {locale === "ar" ? "منتجات ذات صلة" : "Related Products"}
        </h2>
      </div>

      <div className="w-full relative max-w-[1500px] mx-auto group">
        {/* Navigation Arrows - Visible on all devices, absolute positioned on edges */}
        <button 
          onClick={() => scroll("left")}
          className="flex absolute top-1/2 -translate-y-1/2 left-1 md:left-2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center bg-[#FDE619] hover:bg-yellow-400 text-[#002F59] shadow-lg transition-transform hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <button 
          onClick={() => scroll("right")}
          className="flex absolute top-1/2 -translate-y-1/2 right-1 md:right-2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full items-center justify-center bg-[#FDE619] hover:bg-yellow-400 text-[#002F59] shadow-lg transition-transform hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Mask wrapper for fade effect on edges */}
        <div className="w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
          {/* Horizontal scroll container with hidden scrollbar */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 px-10 md:px-16 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
          >
          {products.map((product) => {
            const mainImg = product.images?.[0]?.url;
            return (
              <div key={product.id} className="min-w-[240px] sm:min-w-[280px] snap-center shrink-0 flex justify-center">
                <Link href={`/${locale}/products/details/${product.id}`} className="group flex flex-col items-center">
                  <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    {mainImg ? (
                      <Image
                        src={(mainImg.startsWith("http") || mainImg.startsWith("/")) ? mainImg : `https://camp-coding.site/eloroba/${mainImg}`}
                        alt={locale === "ar" ? product.nameAr : product.nameEn}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-[180px] h-[180px] bg-black/10 rounded-full flex items-center justify-center">
                        <span className="text-black/40">لا توجد صورة</span>
                      </div>
                    )}
                  </div>
                  <h3 
                    className="mt-6 text-xl md:text-2xl font-black text-center transition-transform duration-300 group-hover:scale-105"
                    style={{ color: textColor }}
                  >
                    {locale === "ar" ? product.nameAr : product.nameEn}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
        </div>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
