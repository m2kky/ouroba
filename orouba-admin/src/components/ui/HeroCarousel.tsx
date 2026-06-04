"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface BannerItem {
  id: string;
  isHidden: boolean;
  type: string;
  videoLink?: string;
  videoLinkEn?: string;
  image?: string;
  imageEn?: string;
  smallVideo?: string;
  smallVideoEn?: string;
  smallImg?: string;
  smallImgEn?: string;
}

interface HeroCarouselProps {
  banners: BannerItem[];
  isEn: boolean;
}

export default function HeroCarousel({ banners, isEn }: HeroCarouselProps) {
  const visibleBanners = banners.filter((banner) => {
    const hasDesktopVideo = !!(banner.videoLink || banner.videoLinkEn);
    const hasDesktopImage = !!(banner.image || banner.imageEn);
    const hasMobileVideo = !!(banner.smallVideo || banner.smallVideoEn);
    const hasMobileImage = !!(banner.smallImg || banner.smallImgEn);
    return hasDesktopVideo || hasDesktopImage || hasMobileVideo || hasMobileImage;
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (visibleBanners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex touch-pan-y">
        {visibleBanners.map((banner) => {
          // Desktop Media
          const isVideoDesktop = banner.type === "video";
          const desktopVideoToUse = isEn
            ? banner.videoLinkEn || banner.videoLink
            : banner.videoLink || banner.videoLinkEn;
          const desktopImageToUse = isEn
            ? banner.imageEn || banner.image
            : banner.image || banner.imageEn;
          const mediaDesktop = isVideoDesktop
            ? desktopVideoToUse
            : desktopImageToUse;

          // Mobile Media
          const mobileVideoToUse = isEn
            ? banner.smallVideoEn || banner.smallVideo || desktopVideoToUse
            : banner.smallVideo || banner.smallVideoEn || desktopVideoToUse;
          const mobileImageToUse = isEn
            ? banner.smallImgEn || banner.smallImg || desktopImageToUse
            : banner.smallImg || banner.smallImgEn || desktopImageToUse;
          const isVideoMobile =
            !!mobileVideoToUse || (!mobileImageToUse && isVideoDesktop);
          const mediaMobile =
            mobileVideoToUse || mobileImageToUse || mediaDesktop;

          return (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative w-full h-[50vh] md:h-[90vh]"
            >
              {/* Desktop View */}
              <div className="hidden md:block w-full h-full">
                {isVideoDesktop ? (
                  <video
                    src={mediaDesktop}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover z-0 block"
                  />
                ) : (
                  <img
                    src={mediaDesktop}
                    alt="Hero Banner"
                    className="w-full h-full object-cover z-0 block"
                  />
                )}
              </div>

              {/* Mobile View */}
              <div className="block md:hidden w-full h-full">
                {isVideoMobile ? (
                  <video
                    src={mediaMobile}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover z-0 block"
                  />
                ) : (
                  <img
                    src={mediaMobile}
                    alt="Hero Banner"
                    className="w-full h-full object-cover z-0 block"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {visibleBanners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {visibleBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "bg-orouba-yellow scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
