"use client";
import React from "react";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../../../components/sectionTitle";
import UseGeneral from "../../../hooks/useGeneral";
import { useRouter } from 'next/navigation';
import { localizedPath } from "@/utils/routes";

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const ArrowIcon = ({ direction }) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d={direction === "next" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CustomPrevButton = ({ className = "", onClick }) => (
  <button
    type="button"
    aria-label="Previous product"
    className={["custom-prev-button-ProductTypeSmallSlider", className].filter(Boolean).join(" ")}
    onClick={onClick}
  >
    <ArrowIcon direction="prev" />
  </button>
);

const CustomNextButton = ({ className = "", onClick }) => (
  <button
    type="button"
    aria-label="Next product"
    className={["custom-next-button-ProductTypeSmallSlider", className].filter(Boolean).join(" ")}
    onClick={onClick}
  >
    <ArrowIcon direction="next" />
  </button>
);
function ProductTypeSmallSlider({ withArrows, data, type }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const swiperRef = React.useRef(null);
  const productItems = Array.isArray(data) ? data : [];
  const productTypeCount = productItems.length;
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
          className="relatedProductsSwiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          rewind={productTypeCount > 1}
          slidesPerView={1}
          spaceBetween={18}
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 18,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            992: {
              slidesPerView: Math.min(3, Math.max(1, productTypeCount)),
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : productItems.length ? (
            productItems.map((item) => (
              <SwiperSlide key={item.id}>
                {renderProductType(item)}
              </SwiperSlide>
            ))
          ) : null}
        </Swiper>
        {withArrows && productTypeCount > 1 && (
          <div className="productTypeSliderArrow">
            <CustomPrevButton
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <CustomNextButton
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTypeSmallSlider;

