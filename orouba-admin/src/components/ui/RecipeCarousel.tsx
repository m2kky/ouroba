"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import HoverCard from "@/components/ui/HoverCard";

interface RecipeItem {
  id: string;
  nameEn?: string;
  nameAr?: string;
  internalImage?: string;
  tagEn?: string;
  tagAr?: string;
}

interface RecipeCarouselProps {
  recipes: RecipeItem[];
  isEn: boolean;
  locale: string;
}

export default function RecipeCarousel({ recipes, isEn, locale }: RecipeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 md:px-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-8 touch-pan-y py-4">
          {recipes.map((recipe) => {
            const imageSrc = recipe.internalImage?.startsWith("http")
              ? recipe.internalImage
              : recipe.internalImage?.startsWith("/uploads") || recipe.internalImage?.startsWith("/storage")
              ? recipe.internalImage
              : recipe.internalImage
              ? `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${recipe.internalImage}`
              : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

            return (
              <div
                key={recipe.id}
                className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_350px] lg:flex-[0_0_400px] min-w-0 relative"
              >
                <Link href={`/${locale}/recipes/${recipe.id}`} className="group block h-[450px]">
                  <HoverCard className="rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full relative block border border-gray-100">
                    {/* Full Background Image */}
                    <img
                      src={imageSrc}
                      alt={isEn ? recipe.nameEn || recipe.nameAr : recipe.nameAr}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
                    />

                    {/* Permanent Gradient Overlay for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                    {/* Recipe Type Label */}
                    <div className={`absolute top-6 ${isEn ? "left-6" : "right-6"} z-20`}>
                      <span className="bg-orouba-yellow/95 backdrop-blur-sm text-orouba-blue text-sm font-extrabold px-5 py-2 rounded-full shadow-lg uppercase tracking-wider">
                        {isEn ? recipe.tagEn || "Special Recipe" : recipe.tagAr || "وصفة مميزة"}
                      </span>
                    </div>

                    {/* Content at Bottom */}
                    <div className={`absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full ${isEn ? "text-left" : "text-right"}`}>
                      <h3 className="text-3xl font-bold text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {isEn ? recipe.nameEn || recipe.nameAr : recipe.nameAr}
                      </h3>
                      <div className={`flex items-center text-white/80 opacity-0 group-hover:opacity-100 font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ${isEn ? "" : "flex-row-reverse justify-end"}`}>
                        <span>{isEn ? "View Recipe" : "عرض الوصفة"}</span>
                        <svg className={`w-5 h-5 ${isEn ? "ml-2 rotate-180" : "mr-2"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </div>
                    </div>
                  </HoverCard>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        className={`absolute top-1/2 -left-2 md:-left-6 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 transition-all z-30 ${
          prevBtnDisabled ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-110 hover:bg-gray-50"
        }`}
        aria-label="Previous recipe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 36" fill="none">
          <path d="M25.9482 10.5517L17.0517 18L25.9482 25.4482" stroke="#035297" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        className={`absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 transition-all z-30 ${
          nextBtnDisabled ? "opacity-0 pointer-events-none" : "opacity-100 hover:scale-110 hover:bg-gray-50"
        }`}
        aria-label="Next recipe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 36" fill="none">
          <path d="M17.5508 10.5517L26.4473 18L17.5508 25.4482" stroke="#035297" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
