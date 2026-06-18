"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import UseGeneral from "../../../hooks/useGeneral";
import "swiper/css";

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const hasBannerMedia = (item) =>
  !!first(
    item?.image,
    item?.image_en,
    item?.small_img,
    item?.small_img_en,
    item?.video_link,
    item?.video_link_en,
    item?.small_video,
    item?.small_video_en
  );

const getBannerMedia = (item, language, isSmaller) => {
  const isEnglish = language === "en";
  const desktopImage = isEnglish
    ? first(item?.image, item?.image_en)
    : first(item?.image_en, item?.image);
  const desktopVideo = isEnglish
    ? first(item?.video_link, item?.video_link_en)
    : first(item?.video_link_en, item?.video_link);
  const mobileImage = isEnglish
    ? first(item?.small_img, item?.image, item?.small_img_en, item?.image_en)
    : first(item?.small_img_en, item?.image_en, item?.small_img, item?.image);
  const mobileVideo = isEnglish
    ? first(item?.small_video, item?.video_link, item?.small_video_en, item?.video_link_en)
    : first(item?.small_video_en, item?.video_link_en, item?.small_video, item?.video_link);
  const isVideo = item?.type === "video" && !!first(mobileVideo, desktopVideo);

  if (isVideo) {
    return {
      isVideo: true,
      src: isSmaller
        ? first(mobileVideo, desktopVideo, mobileImage, desktopImage)
        : first(desktopVideo, mobileVideo, desktopImage, mobileImage),
      poster: isSmaller
        ? first(mobileImage, desktopImage)
        : first(desktopImage, mobileImage),
    };
  }

  return {
    isVideo: false,
    src: isSmaller
      ? first(mobileImage, desktopImage, mobileVideo, desktopVideo)
      : first(desktopImage, mobileImage, desktopVideo, mobileVideo),
  };
};

const Banner = ({ data }) => {
  const { language } = UseGeneral();
  const bannerRootRef = useRef(null);
  const visibleBanners = useMemo(
    () => {
      if (!Array.isArray(data)) return [];
      const filtered = data.filter((item) => {
        if (!hasBannerMedia(item)) return false;

        const isEnglish = language === "en";

        // Check if the item explicitly has media for EN vs AR (reversed based on old backend data structure)
        const hasEnMedia = !!first(item?.image, item?.small_img, item?.video_link, item?.small_video);
        const hasArMedia = !!first(item?.image_en, item?.small_img_en, item?.video_link_en, item?.small_video_en);

        // If it's explicitly uploaded for one language, don't show it in the other.
        if (isEnglish && hasEnMedia && !hasArMedia) return true;
        if (!isEnglish && hasArMedia && !hasEnMedia) return true;

        // If it has both, we can show it in both languages.
        if (hasEnMedia && hasArMedia) return true;
        
        // If it has NO media for the current language, don't show it
        return false;
      });
      return filtered.length > 0 ? [filtered[0]] : [];
    },
    [data, language]
  );
  const bannerCount = visibleBanners.length;
  const [isSmaller, setIsSmaller] = useState(false);
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  const syncSlideVideos = useCallback(() => {
    const root = bannerRootRef.current;
    if (!root) return;

    root.querySelectorAll(".swiper-slide").forEach((slide) => {
      const isActive = slide.classList.contains("swiper-slide-active");

      slide.querySelectorAll("video").forEach((video) => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        if (!isActive) {
          video.pause();
          video.currentTime = 0;
          return;
        }

        const playVideo = () => {
          video.play().catch(() => {});
        };

        if (video.readyState >= 2) {
          playVideo();
        } else {
          video.addEventListener("canplay", playVideo, { once: true });
        }
      });
    });
  }, []);

  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 767px)");

      if (mediaQuery.matches) {
        setIsSmaller(true);
      } else {
        setIsSmaller(false);
      }
    };

    updateMenuHeights();

    const handleResize = () => {
      updateMenuHeights();
    };

    (typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener("resize", handleResize);

    return () => {
      (typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(syncSlideVideos, 100);
    return () => window.clearTimeout(timeoutId);
  }, [syncSlideVideos, visibleBanners, isSmaller, language, canLoadVideo]);

  useEffect(() => {
    const startVideoLoad = () => {
      const timeoutId = window.setTimeout(() => setCanLoadVideo(true), 4000);
      return () => window.clearTimeout(timeoutId);
    };

    if (document.readyState === "complete") {
      return startVideoLoad();
    }

    let cleanup = () => {};
    const handleLoad = () => {
      cleanup = startVideoLoad();
    };

    window.addEventListener("load", handleLoad, { once: true });
    return () => {
      window.removeEventListener("load", handleLoad);
      cleanup();
    };
  }, []);

  return (
    <div className="rowDiv bannerDiv" ref={bannerRootRef}>
      {!bannerCount ? (
        <span
          style={{
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          {/* <Loader size="lg" /> */}
        </span>
      ) : (
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          // navigation={true}
          // effect={"cube"}
          modules={[FreeMode, Pagination, Autoplay]}
          // pagination={true}
          pagination={{ clickable: false }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove={false}
          simulateTouch={false}
          grabCursor={false}
          touchRatio={0}
          shortSwipes={false}
          longSwipes={false}
          followFinger={false}
          loop={bannerCount > 1}
          onSwiper={syncSlideVideos}
          onSlideChange={syncSlideVideos}
          onTransitionEnd={syncSlideVideos}
          // dir={language != "en" ? "rtl" : "ltr"}
          key={`${language}-${isSmaller ? "mobile" : "desktop"}`}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
          }}
        >
          {visibleBanners.map((item, index) => {
            const media = getBannerMedia(item, language, isSmaller);

            return (
              <SwiperSlide key={item?.id || index}>
                <div className="banner">
                  {!media.src ? null : media.isVideo ? (
                    <>
                      {!canLoadVideo && media.poster ? (
                        <img
                          src={media.poster}
                          style={{ maxWidth: "100%", minWidth: "100%" }}
                          alt=""
                          draggable={false}
                          fetchPriority="high"
                          decoding="async"
                          onDragStart={(event) => event.preventDefault()}
                        />
                      ) : null}
                      {canLoadVideo ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          src={media.src}
                          poster={media.poster || undefined}
                          controls={false}
                          draggable={false}
                          onDragStart={(event) => event.preventDefault()}
                          onCanPlay={syncSlideVideos}
                          onLoadedData={syncSlideVideos}
                          onPlay={(event) => {
                            if (
                              !event.currentTarget
                                .closest(".swiper-slide")
                                ?.classList.contains("swiper-slide-active")
                            ) {
                              event.currentTarget.pause();
                            }
                          }}
                        ></video>
                      ) : null}
                    </>
                  ) : (
                    <img
                      src={media.src}
                      style={{ maxWidth: "100%", minWidth: "100%" }}
                      alt=""
                      draggable={false}
                      fetchPriority={index === 0 ? "high" : "low"}
                      decoding="async"
                      onDragStart={(event) => event.preventDefault()}
                    />
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;
