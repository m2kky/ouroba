import React, { useState } from "react";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../../../components/sectionTitle";
import "./style.css";
import UseGeneral from "../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const CustomPrevButton = ({ onClick }) => (
  <button className="custom-prev-button" onClick={onClick}>
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
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    }
  </button>
);

const CustomNextButton = ({ onClick }) => (
  <button className="custom-next-button" onClick={onClick}>
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
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    }
  </button>
);
function Recips({ withArrows, data }) {
  const { language } = UseGeneral();
  const naviagte = useNavigate();
  return (
    <div className="hero_section pb-4 reciepe_section d-flex justify-content-between flex-column w-full rowDiv">
      {/* <img className='background_img' src="https://res.cloudinary.com/duovxefh6/image/upload/v1716715996/WhatsApp_Image_2024-05-26_at_11.01.20_c622f338-removebg-preview_endygb.png" alt="" /> */}
      {data && data?.length ? (
        <SectionTitle
          rem={true}
          minColorWord={withArrows ? "Recommended " : "Latest "}
          minColorWordAr={withArrows ? "مقترحة" : "أحدث "}
          secondColorWord={"Recipes"}
          secondColorWordAr={"وصفات"}
          linkName={"Show More"}
          linkNameAr={"عرض المزيد"}
          link={"/Reciepe"}
          language={"ar"}
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
      ) : null}

      <div
        className={`brandsImages rec_brand_imgs ${
          language == "ar" ? "active" : ""
        }`}
      >
        <Swiper
          loop={true}
          navigation={{
            prevEl: ".custom-prev-button",
            nextEl: ".custom-next-button",
          }}
          slidesPerView={6}
          modules={[Navigation, FreeMode]}
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 2,
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

            3000: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
          }}
        >
          {!data ? (
            <ContentLoader />
          ) : data?.length ? (
            data?.map((item, index) => {
              if (index < 7)
                return (
                  <SwiperSlide key={item.id}>
                    <div
                      style={{
                        // backgroundColor: "red",
                        justifyContent: "flex-end",
                      }}
                      className="reciepe"
                      onClick={() =>
                        naviagte(
                          `/recipe_details/${item.id}/${
                            language == "ar"
                              ? item?.recipe?.name_ar
                              : item?.recipe?.name_en
                          }/${item?.recipe?.id}/${
                            language == "ar"
                              ? item?.food?.name_ar
                              : item?.food?.name_en
                          }/${item?.food?.id}?id=` + item?.id
                        )
                      }
                    >
                      <img
                        src={item?.images[0]?.url}
                        alt={language == "ar" ? item?.name_ar : item?.name_en}
                      />
                      <div className="reciepe_name">
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

export default Recips;
