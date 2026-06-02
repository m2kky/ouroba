"use client";
import React, { useState } from "react";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../../../components/sectionTitle";
import UseGeneral from "../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { useRouter } from 'next/navigation';
import { localizedPath } from "@/utils/routes";

const CustomPrevButton = ({ onClick }) => (
  <button
    className="custom-prev-button-ProductTypeSmallSlider"
    onClick={onClick}
  >
    {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
      >
        <path
          d="M17.5508 10.5517L26.4473 18L17.5508 25.4482"
          stroke="#035297"
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  </button>
);

const CustomNextButton = ({ onClick }) => (
  <button
    className="custom-next-button-ProductTypeSmallSlider"
    onClick={onClick}
  >
    {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="43"
        height="36"
        viewBox="0 0 43 36"
        fill="none"
      >
        <path
          d="M25.9482 10.5517L17.0517 18L25.9482 25.4482"
          stroke="#035297"
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  </button>
);
function ProductTypeSmallSlider({ withArrows, data, type, brandId }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const productTypeCount = Array.isArray(data) ? data.length : 0;
  return (
    <div className="hero_section pb-4 ProductTypeSmallSlider  reciepe_section d-flex justify-content-between flex-column w-full rowDiv">
      <SectionTitle
        rem={true}
        minColorWord={"Other Types Of "}
        minColorWordAr={"أنواع أخرى من "}
        secondColorWord={type?.name_en}
        secondColorWordAr={type?.name_ar}
        ru={true}
        classessName={
          [
            // "justify-content-center",
            // "align-item-center",
            // "text-center",
          ]
        }
        headerClassessName={
          [
            // "justify-content-center",
            // "align-item-center",
            // "text-center",
          ]
        }
      />
      <div className="brandsImages">
        <Swiper
          loop={productTypeCount > 5}
          className="brandLargeScreen"
          navigation={{
            prevEl: ".custom-prev-button-ProductTypeSmallSlider",
            nextEl: ".custom-next-button-ProductTypeSmallSlider",
          }}
          slidesPerView={5}
          modules={[Navigation, FreeMode]}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <div
                    className="product_type"
                    onClick={() =>
                      router.push(
                        localizedPath(
                          `/brands/${item?.brand?.id}/categories/${item?.category?.id}?q=${item?.category?.id}`,
                          language
                        )
                      )
                    }
                  >
                    <img src={item?.images[0]?.url} alt={item.name} />
                    <div className="product_type_name">
                      {language == "ar" ? item?.name_ar : item?.name_en}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          ) : null}
        </Swiper>
        <Swiper
          loop={productTypeCount > 4}
          className="brandSmallScreen"
          navigation={{
            prevEl: ".custom-prev-button-ProductTypeSmallSlider",
            nextEl: ".custom-next-button-ProductTypeSmallSlider",
          }}
          slidesPerView={4}
          modules={[Navigation, FreeMode]}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            // when window width is >= 480px
            480: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <div
                    className="product_type"
                    onClick={() =>
                      router.push(
                        localizedPath(
                          `/brands/${item?.brand?.id}/categories/${item?.category?.id}?q=${item?.category?.id}`,
                          language
                        )
                      )
                    }
                  >
                    <img src={item?.images[0]?.url} alt={item.name} />
                    <div className="product_type_name">
                      {language == "ar" ? item?.name_ar : item?.name_en}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          ) : null}
        </Swiper>
        {withArrows && data?.length > 3 && (
          <div className="productTypeSliderArrow">
            <CustomPrevButton />
            <CustomNextButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTypeSmallSlider;

