"use client";
import React, { useEffect, useState } from "react";
import { Autoplay, EffectCube, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import UseGeneral from "../../../hooks/useGeneral";
import "swiper/css";
import {  Axios  } from '@/Axios';
import {  BASE_URL  } from '@/Axios/base_url';
const Banner = ({ data }) => {
  const { language } = UseGeneral();
  const bannerCount = Array.isArray(data) ? data.length : 0;
  const [banners, setBanners] = useState([
    {
      background_image: "",
    },
    {
      background_image: "",
    },
  ]);
  const [pageLoading, setPageLoading] = useState(false);
  // const getBanners = () => {
  //   setPageLoading(true);
  //   Axios({
  //     url: BASE_URL + `banners/get_all_user`,
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       // console.log(res,"dwwe")
  //       if (res.status == "success") {
  //         setBanners(res.result?.banners);
  //       }
  //       // console.log(res)
  //     })
  //     .finally(() => {
  //       setPageLoading(false);
  //     });
  // };
  // useEffect(() => {
  //   getBanners();
  // }, []);

  const [isSmaller, setIsSmaller] = useState(false);
  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 500px)");

      if (mediaQuery.matches) {
        setIsSmaller(true);
      } else {
        setIsSmaller(false);
      }
    };

    updateMenuHeights();

    // Optionally, you can add a resize event listener to handle window resizing
    const handleResize = () => {
      updateMenuHeights();
    };

    (typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener("resize", handleResize);

    return () => {
      (typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="rowDiv bannerDiv">
      {!data && !data?.length ? (
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
          autoplay={{ delay: 5000 }}
          allowTouchMove={false}
          simulateTouch={false}
          noSwiping={true}
          noSwipingClass="swiper-no-swiping"
          loop={bannerCount > 1}
          // dir={language != "en" ? "rtl" : "ltr"}
          key={language != "en"}
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
          {data?.map((item, index) => {
            const imageSrc = isSmaller
              ? language == "en"
                ? item?.small_img || item?.image
                : item?.small_img_en || item?.image_en
              : language == "en"
              ? item?.image
              : item?.image_en;
            const videoSrc = isSmaller
              ? language == "en"
                ? item?.small_video || item?.video_link
                : item?.small_video_en || item?.video_link_en
              : language == "en"
              ? item?.video_link
              : item?.video_link_en;

            return (
              <SwiperSlide key={index}>
                <div className="banner">
                  {item?.type != "video" ? (
                    imageSrc ? (
                      <img
                        src={imageSrc}
                        style={{ maxWidth: "100%", minWidth: "100%" }}
                        alt=""
                      />
                    ) : null
                  ) : (
                    videoSrc ? (
                      <video
                        loop
                        muted
                        autoPlay
                        src={videoSrc}
                        controls={false}
                      ></video>
                    ) : null
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
