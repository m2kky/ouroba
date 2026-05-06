import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { WhiteArrowLeft } from "../../../assets/svgIcons";
import "./style.css";
import UseGeneral from "../../../hooks/useGeneral";

function Recips({ data, type }) {
  const naviagte = useNavigate();
  const [brands, setBrands] = useState([
    {
      image: require("../../../assets/Artboard6.jpg"),
    },
    {
      image: require("../../../assets/Artboard7.jpg"),
    },
    {
      image: require("../../../assets/Artboard8.jpg"),
    },
    {
      image: require("../../../assets/Artboard9.jpg"),
    },
    {
      image: require("../../../assets/Artboard6.jpg"),
    },
  ]);
  const { language } = UseGeneral();

  useEffect(() => {
    console.log(data);
  }, [data]);
  const [processedCats, setProcessedCats] = useState([]);

  useEffect(() => {
    const updatedCats =
      language === "en"
        ? data?.relatedCats
        : data?.relatedCats
            ?.slice()
            .reverse()
            ?.sort((a, b) =>b.number- a.number);
    setProcessedCats(updatedCats);
    console.log(updatedCats);
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
                  return (
                    <SwiperSlide key={item.id}>
                      <div
                        className="reciepe"
                        style={{ background: `url(${item?.image})` }}
                        onClick={() =>
                          naviagte(
                            `/Brands/${
                              language == "ar"
                                ? data?.brand?.name_ar
                                : data?.brand?.name_en
                            }/${data?.brand?.id}/${item?.id}/${
                              language == "ar" ? item?.name_ar : item?.name_en
                            }?q=${item?.id}`
                          )
                        }
                      >
                        {/* <img src={} alt={item.name} /> */}
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
                          // to={"/recipe_details?id=" + item?.id}
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
              <div
                className={type == "brands" ? "brandSmallScreen" : ""}
                loop={true}
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
                    return (
                      <SwiperSlide key={item.id}>
                        <div
                          className="reciepe"
                          style={{ background: `url(${item?.image})` }}
                          onClick={() =>
                            naviagte(
                              `/Brands/${
                                language == "ar"
                                  ? data?.brand?.name_ar
                                  : data?.brand?.name_en
                              }/${data?.brand?.id}/${item?.id}/${
                                language == "ar" ? item?.name_ar : item?.name_en
                              }?q=${item?.id}`
                            )
                          }
                        >
                          {/* <img src={} alt={item.name} /> */}
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
                            // to={"/recipe_details?id=" + item?.id}
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
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Recips;
