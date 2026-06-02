"use client";
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import { WhiteArrowLeft } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";

function Recips({ data, type }) {
  const naviagte = useRouter();
  const [brands, setBrands] = useState([
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
  ]);
  const { language } = UseGeneral();

  const [processedCats, setProcessedCats] = useState([]);
  const processedCatsCount = Array.isArray(processedCats)
    ? processedCats.length
    : 0;

  useEffect(() => {
    const updatedCats =
      language === "en"
        ? data?.relatedCats
        : data?.relatedCats
            ?.slice()
            .reverse()
            ?.sort((a, b) =>b.number- a.number);
    setProcessedCats(updatedCats);
  }, [language, data]);

  return (
    <>
      {data?.relatedCats?.length && data?.relatedCats ? (
        <div
          className="hero_section min_mar  reciepe_section d-flex justify-content-between flex-column w-full rowDiv"
          style={{ marginBottom: "46px 6px", width: "100%" }}
        >
          <div
            className="brandsImages brandCategory"
            style={{ marginBottom: "46px 6px", width: "100%" }}
          >
            <Swiper
              className={type == "brands" ? "brandLargeScreen" : ""}
              // loop={true}
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
                  slidesPerView: 3,
                  spaceBetween: 60,
                },

                1500: {
                  slidesPerView: 5,
                  spaceBetween: 60,
                },
              }}
            >
              {!processedCats ? (
                <ContentLoader />
              ) : processedCats?.length ? (
                processedCats?.map((item) => {
                  const categoryUrl = `/${language}/brands/${data?.brand?.id}/categories/${item?.id}?q=${item?.id}`;

                  return (
                    <SwiperSlide key={item.id}>
                      <div
                        className="reciepe"
                        style={item?.image ? { background: `url(${item.image})` } : undefined}
                        onClick={() => naviagte.push(categoryUrl)}
                      >
                        <p>
                          {language == "ar" ? item?.name_ar : item?.name_en}
                        </p>
                        <Link
                          style={{
                            color: "var(--primary-farida, #005097)",
                            fontFamily: "Cairo",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "120%", // You can directly use percentage
                            textDecorationLine: "underline",
                          }}
                          href={categoryUrl}
                        >
                          {language == "ar" ? "إظهار الكل" : "View All"}
                          <span
                            style={{
                              rotate: language == "ar" ? "180deg" : "0",
                            }}
                          >
                            {WhiteArrowLeft}
                          </span>
                        </Link>
                      </div>
                    </SwiperSlide>
                  );
                })
              ) : null}
            </Swiper>

            {type == "brands" ? (
              <Swiper
                className={type == "brands" ? "brandSmallScreen" : ""}
                loop={processedCatsCount > 4}
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
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },

                  1500: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                }}
              >
                {!processedCats ? (
                  <ContentLoader />
                ) : processedCats?.length ? (
                  processedCats?.map((item) => {
                    const categoryUrl = `/${language}/brands/${data?.brand?.id}/categories/${item?.id}?q=${item?.id}`;

                    return (
                      <SwiperSlide key={item.id}>
                        <div
                          className="reciepe"
                          style={item?.image ? { background: `url(${item.image})` } : undefined}
                          onClick={() => naviagte.push(categoryUrl)}
                        >
                          <p>
                            {language == "ar" ? item?.name_ar : item?.name_en}
                          </p>
                          <Link
                            style={{
                              color: "var(--primary-farida, #005097)",
                              fontFamily: "Cairo",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "120%", // You can directly use percentage
                              textDecorationLine: "underline",
                            }}
                            href={categoryUrl}
                          >
                            {language == "ar" ? "إظهار الكل" : "View All"}
                            <span
                              style={{
                                rotate: language == "ar" ? "180deg" : "0",
                              }}
                            >
                              {WhiteArrowLeft}
                            </span>
                          </Link>
                        </div>
                      </SwiperSlide>
                    );
                  })
                ) : null}
              </Swiper>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Recips;
