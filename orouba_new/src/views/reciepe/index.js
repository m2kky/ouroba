"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { arrowLeft } from "../../assets/svgIcons";
import UseGeneral from "../../hooks/useGeneral";
import { ThreeDots } from "react-loader-spinner";
import CategoriesSlider from "../../layouts/reciepe/categories";
import { localizedPath } from "@/utils/routes";

const Reciepe = ({ recipesPageData }) => {
  const { language } = UseGeneral();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, recs, cooks, selectedCategoryId, selectedFoodId } = recipesPageData;

  const currentC =
    selectedCategoryId || searchParams.get("c") || (data?.length > 0 ? data[0].id : null);
  const currentSC =
    selectedFoodId || searchParams.get("s_c") || (recs?.length > 0 ? recs[0].id : null);

  const handleCategoryClick = (id) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("c", currentC);
    newParams.set("s_c", id);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectedCategoryName = language == "ar"
    ? data?.find((item) => item?.id == currentC)?.name_ar
    : data?.find((item) => item?.id == currentC)?.name_en;

  const selectedRecName = language == "ar"
    ? recs?.find((item) => item?.id == currentSC)?.name_ar
    : recs?.find((item) => item?.id == currentSC)?.name_en;

  const [openCategoriesMenu, setOpenCategoriesMenu] = useState(false);

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          marginTop: "45px",
          marginBottom: "28px",
        }}
      >
        <CategoriesSlider data={data} currentC={currentC} />
        {data && data?.length ? (
          <h2 className="rowDiv categoryName">
            {selectedCategoryName}
          </h2>
        ) : null}
        {data && data?.length ? (
          <>
            {!recs ? (
              <div className="rowDiv">
                <ThreeDots color="#035297" />
              </div>
            ) : recs?.length ? (
              <div className="rowDiv gridDiv">
                <div className="rec_name rowDiv">
                  <h3
                    style={{ color: "var(--main-color)" }}
                    onClick={() => setOpenCategoriesMenu(!openCategoriesMenu)}
                  >
                    {selectedRecName}{" "}
                    <span
                      style={{
                        rotate: openCategoriesMenu ? "90deg" : "0deg",
                        transition: "0.5s ease-in-out",
                      }}
                    >
                      {" "}
                      {arrowLeft}
                    </span>
                  </h3>
                </div>
                <div
                  className={
                    openCategoriesMenu
                      ? "sidebar_reciepe open"
                      : "sidebar_reciepe"
                  }
                >
                  {recs?.map((item) => (
                    <span
                      key={item?.id}
                      className={
                        item?.id == currentSC
                          ? `receipeName active`
                          : `receipeName`
                      }
                      onClick={() => {
                        if (item?.id != currentSC) {
                          setOpenCategoriesMenu(!openCategoriesMenu);
                          handleCategoryClick(item?.id);
                        }
                      }}
                    >
                    {language == "ar" ? item?.nameAr || item?.name_ar : item?.nameEn || item?.name_en}
                    </span>
                  ))}
                </div>
                {!cooks ? (
                  <div className="rowDiv">
                    <ThreeDots color="#035297" />
                  </div>
                ) : cooks?.length ? (
                  <div className="brandsImages brandsImagesGrid">
                    {cooks?.map((item, index) => (
                      <div
                        key={index}
                        className="receipe_block"
                        onClick={() =>
                          router.push(
                            localizedPath(`/recipe_details/${item.id}`, language)
                          )
                        }
                      >
                        <div className="item_row">
                          <img
                            src={item?.images?.[0]?.url}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                          />
                        </div>
                        <div className="receipe_details">
                          <h4 style={{ textAlign: "center" }}>
                            {language == "ar" ? item?.nameAr || item?.name_ar : item?.nameEn || item?.name_en}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rowDiv">
                    <h3 style={{ fontSize: "23px", margin: "20px auto" }}>
                      No Recipes
                    </h3>
                  </div>
                )}
              </div>
            ) : (
              <div className="rowDiv">
                <h3 style={{ fontSize: "23px", margin: "20px auto" }}>
                  No Foods
                </h3>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Reciepe;
