"use client";
import React from "react";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "../../../components/sectionTitle";
import UseGeneral from "../../../hooks/useGeneral";
import { FreeMode, Navigation } from "swiper/modules";
import { useRouter } from 'next/navigation';
import { localizedPath } from "@/utils/routes";
import LazyImage from "../../../components/LazyImage";
import { localizedText, splitHeading } from "@/utils/siteText";

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

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
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  </button>
);
function Recips({ withArrows, data, siteinfo }) {
  const { language } = UseGeneral();
  const naviagte = useRouter();
  const recipeCount = Array.isArray(data) ? Math.min(data.length, 7) : 0;
  const sectionTitle = localizedText(
    siteinfo,
    language,
    ["home_recipes_title"],
    language === "ar"
      ? withArrows
        ? "وصفات مقترحة"
        : "أحدث وصفات"
      : withArrows
        ? "Recommended Recipes"
        : "Latest Recipes"
  );
  const sectionTitleParts = splitHeading(sectionTitle);
  const firstTitlePart = sectionTitleParts.rest ? sectionTitleParts.first.trim() : "";
  const secondTitlePart = sectionTitleParts.rest || sectionTitleParts.first;
  const recipeName = (item) =>
    language == "ar"
      ? firstText(item?.name_ar, item?.nameAr, item?.name)
      : firstText(item?.name_en, item?.nameEn, item?.name);
  const recipeImage = (item) =>
    firstText(
      item?.images?.[0]?.url,
      item?.internal_image,
      item?.internalImage,
      item?.image
    );

  return (
    <div className="hero_section pb-4 reciepe_section d-flex justify-content-between flex-column w-full rowDiv">
      {/* <img className='background_img' src="https://res.cloudinary.com/duovxefh6/image/upload/v1716715996/WhatsApp_Image_2024-05-26_at_11.01.20_c622f338-removebg-preview_endygb.png" alt="" /> */}
      {data && data?.length ? (
        <SectionTitle
          rem={true}
          minColorWord={firstTitlePart}
          minColorWordAr={firstTitlePart}
          secondColorWord={secondTitlePart}
          secondColorWordAr={secondTitlePart}
          ru={true}
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
          titleHtml={sectionTitle}
        />
      ) : null}

      <div
        className={`brandsImages rec_brand_imgs ${
          language == "ar" ? "active" : ""
        }`}
      >
        <Swiper
          loop={recipeCount > 6}
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
                {
                  const image = recipeImage(item);
                  const name = recipeName(item);

                return (
                  <SwiperSlide key={item.id}>
                    <div
                      style={{
                        // backgroundColor: "red",
                        justifyContent: "flex-end",
                      }}
                      className="reciepe"
                      onClick={() =>
                        naviagte.push(localizedPath(`/recipe_details/${item.id}`, language))
                      }
                    >
                      {image ? (
                        <LazyImage
                          src={image}
                          alt={name}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      ) : null}
                      <div className="reciepe_name">
                        {name}
                      </div>
                    </div>
                  </SwiperSlide>
                );
                }
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
