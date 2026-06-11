"use client";
import React from "react";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../../../components/sectionTitle";
import UseGeneral from "../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { useRouter } from 'next/navigation';
import { localizedPath } from "@/utils/routes";

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const CustomPrevButton = ({ onClick }) => (
  <button
    type="button"
    aria-label="Previous product"
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
    type="button"
    aria-label="Next product"
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
function ProductTypeSmallSlider({ withArrows, data, type }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const productTypeCount = Array.isArray(data) ? data.length : 0;
  const largeSlidesPerView =
    productTypeCount > 3 ? 3 : Math.max(1, productTypeCount - 1);
  const smallSlidesPerView =
    productTypeCount > 2 ? 2 : Math.max(1, productTypeCount - 1);
  const relatedNameEn = firstText(type?.name_en, type?.nameEn);
  const relatedNameAr = firstText(type?.name_ar, type?.nameAr);

  const productName = (item) =>
    language == "ar"
      ? firstText(item?.name_ar, item?.nameAr, item?.name)
      : firstText(item?.name_en, item?.nameEn, item?.name);
  const productImage = (item) =>
    firstText(item?.images?.[0]?.url, item?.image, item?.internal_image, item?.internalImage);
  const goToProduct = (item) => {
    if (item?.id) {
      router.push(localizedPath(`/products/${item.id}`, language));
    }
  };
  const renderProductType = (item, className = "") => {
    const image = productImage(item);
    const name = productName(item);

    return (
      <div
        className={["product_type", className].filter(Boolean).join(" ")}
        onClick={() => goToProduct(item)}
      >
        {image ? <img src={image} alt={name} /> : null}
        <div className="product_type_name">
          {name}
        </div>
      </div>
    );
  };

  return (
    <div className="hero_section pb-4 ProductTypeSmallSlider  reciepe_section d-flex justify-content-between flex-column w-full rowDiv">
      <SectionTitle
        rem={true}
        minColorWord={"Other Types Of "}
        minColorWordAr={"أنواع أخرى من "}
        secondColorWord={relatedNameEn}
        secondColorWordAr={relatedNameAr}
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
          loop={productTypeCount > 4}
          className="brandLargeScreen"
          navigation={{
            prevEl: ".custom-prev-button-ProductTypeSmallSlider",
            nextEl: ".custom-next-button-ProductTypeSmallSlider",
          }}
          slidesPerView={largeSlidesPerView}
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
              slidesPerView: largeSlidesPerView,
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item) => (
              <SwiperSlide key={item.id}>
                {renderProductType(item)}
              </SwiperSlide>
            ))
          ) : null}
        </Swiper>
        <Swiper
          loop={productTypeCount > 3}
          className="brandSmallScreen"
          navigation={{
            prevEl: ".custom-prev-button-ProductTypeSmallSlider",
            nextEl: ".custom-next-button-ProductTypeSmallSlider",
          }}
          slidesPerView={smallSlidesPerView}
          modules={[Navigation, FreeMode]}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width is >= 480px
            480: {
              slidesPerView: smallSlidesPerView,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: smallSlidesPerView,
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item) => (
              <SwiperSlide key={item.id}>
                {renderProductType(item)}
              </SwiperSlide>
            ))
          ) : null}
        </Swiper>
        <div className="productTypeMobileList">
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item) => (
              <div className="productTypeMobileListItem" key={item.id}>
                {renderProductType(item, "product_type_mobile_card")}
              </div>
            ))
          ) : null}
        </div>
        {withArrows && productTypeCount > 1 && (
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

