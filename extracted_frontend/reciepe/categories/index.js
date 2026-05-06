import React, { useEffect, useState } from "react";
import "./style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import ContentLoader from "react-content-loader";
import UseGeneral from "./../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { arrowLeft } from "../../../assets/svgIcons";
import Breadcrumb from "../../../components/BreadCumbsLinks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
function CategoriesSlider({ data, setRecs, setCooks }) {
  const { language } = UseGeneral();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (
      (!params.get("c") ||
        !params.get("c")?.length ||
        params.get("c") == "null") &&
      data?.length &&
      data
    ) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("c", data ? data[0]?.id?.toString() : "");
      newParams.set("s_c", "");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [data]);
  const handleCategoryClick = (id) => {
    if (id != params.get("c")) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("c", id);
      newParams.set("s_c", "");
      navigate(`?${newParams.toString()}`, { replace: true });
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
            stroke-width="3"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
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
            // navigation={true}
            className={language == "en" ? "categorySlider":"categorySlider arabicCS"}
            // loop={true}
            slidesPerView={7}
            spaceBetween={50}
            // direction={language == "ar" ? "rtl" : "ltr"}
            dir={language == "ar" ? "rtl" : "ltr"}
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 2,
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
              792: {
                slidesPerView: 5,
                spaceBetween: 30,
              },

              992: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
            }}
          >
            {data?.map((item) => {
              return (
                <SwiperSlide key={item.id} style={{ cursor: "pointer" }}>
                  <div
                    className="category"
                    onClick={() => {
                      if (item?.id != params.get("c")) {
                        handleCategoryClick(item?.id);
                        if (setRecs) {
                          setRecs((prev) => null);
                        }
                        if (setCooks) {
                          setCooks(null);
                        }
                      }
                    }}
                  >
                    <img src={item?.image} alt={item.name} />
                    <div className="category_name">
                      {language == "ar" ? item?.name_ar : item?.name_en}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
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
