"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import UseGeneral from "./../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { arrowLeft } from "../../../assets/svgIcons";
import Breadcrumb from "../../../components/BreadCumbsLinks";
import { useRouter, useSearchParams } from 'next/navigation';
import { ThreeDots } from "react-loader-spinner";

function CategoriesSlider({ data, currentC }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (id) => {
    if (id != currentC) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("c", id);
      newParams.set("s_c", "");
      router.push(`?${newParams.toString()}`, { scroll: false });
    }
  };

  const CustomPrevButton = (
    <div className="custom-prev-button category-custom-prev-button">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="43"
          height="36"
          viewBox="0 0 43 36"
          fill="none"
        >
          <path
            d="M25.9483 10.5517L17.0518 18L25.9483 25.4482"
            stroke="#002F59"
            strokeWidth="3"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
  
  const CustomNextButton = (
    <div className="custom-next-button category-custom-next-button">
      <span>{arrowLeft}</span>
    </div>
  );

  return (
    <div className="rowDiv" style={{ position: "relative" }}>
      <Breadcrumb
        links={[
          { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
          { name: language == "ar" ? "الوصفات" : "Recipes", active: true },
        ]}
      />
      {!data ? (
        <div className="rowDiv">
          {" "}
          <ThreeDots color="#035297" />
        </div>
      ) : data?.length ? (
        <>
          {" "}
          <Swiper
            navigation={{
              prevEl: ".custom-prev-button",
              nextEl: ".custom-next-button",
            }}
            modules={[Navigation, FreeMode]}
            className={language == "en" ? "categorySlider" : "categorySlider arabicCS"}
            slidesPerView={7}
            spaceBetween={50}
            dir={language == "ar" ? "rtl" : "ltr"}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              480: { slidesPerView: 3, spaceBetween: 20 },
              640: { slidesPerView: 4, spaceBetween: 30 },
              792: { slidesPerView: 5, spaceBetween: 30 },
              992: { slidesPerView: 6, spaceBetween: 30 },
              1200: { slidesPerView: 6, spaceBetween: 30 },
            }}
          >
            {data?.map((item) => (
              <SwiperSlide key={item.id} style={{ cursor: "pointer" }}>
                <div
                  className="category"
                  onClick={() => handleCategoryClick(item?.id)}
                >
                  <img src={item?.image} alt={item.nameEn} />
                  <div className="category_name">
                    {language == "ar" ? item?.nameAr : item?.nameEn}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>{" "}
          <div className="buttons">
            {CustomPrevButton}
            {CustomNextButton}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default CategoriesSlider;
