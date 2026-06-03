"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";

const categoryImageTypes = new Set(["frozen fruits", "pre-fried"]);

const normalizedTitle = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const shouldUseCategoryImages = (type) =>
  categoryImageTypes.has(normalizedTitle(type?.titleEn));

const hideBrokenMainImage = (event) => {
  const imageBox = event.currentTarget.closest(".product_continer_img");
  if (imageBox) {
    imageBox.style.display = "none";
  }
};

const hideBrokenThumb = (event) => {
  event.currentTarget.style.display = "none";
};

const getCategoryImage = (type, item, language) => {
  if (shouldUseCategoryImages(type)) {
    return language === "ar"
      ? item?.relation_image || item?.category_image
      : item?.relation_image || item?.category_image_en || item?.category_image;
  }

  return item?.brand?.image || item?.category_image_en || item?.category_image;
};

const isUnresolvedLegacyImage = (src) =>
  String(src || "").includes("camp-coding.site/eloroba/storage/app/images/");

function ProductType({ types, pageDataObj }) {
  const { language } = UseGeneral();
  const productTypeImage = pageDataObj?.product_type_img;
  const visibleTypes = Array.isArray(types)
    ? types.filter((item) => normalizedTitle(item?.titleEn) !== "products")
    : [];

  return (
    <>
      <div className="px-4 my-5 text-start downHeaderDiv rowDiv">
        <Breadcrumb
          links={[
            {
              name: language == "ar" ? "الصفحة الرئيسية" : "Home",
              route: "/",
            },
            {
              name: language == "ar" ? "عن العروبة" : "About US",
              route: "/",
            },
            {
              name: language == "ar" ? "أصناف المنتجات" : "Product Type",
              active: true,
            },
          ]}
        />
        <div
          style={
            productTypeImage
              ? { backgroundImage: `url(${productTypeImage})` }
              : undefined
          }
          className="products_types_info"
          id="products_types_info"
        >
          <div className="types_title">
            <h1 className="page_title" style={{ padding: "0" }}>
              {language == "ar" ? "أصناف المنتجات" : "Product Types"}
            </h1>
            <p
              style={{
                color: "#002F59",
                width: "80%",
                fontSize: "18px",
                marginTop: "16px",
              }}
            >
              {language == "ar"
                ? pageDataObj?.product_type_text_ar
                : pageDataObj?.product_type_text_en}
            </p>
          </div>

          {visibleTypes.map((item, index) => {
            const isEven = index % 2 === 0;
            const mainImage = isUnresolvedLegacyImage(item.image)
              ? null
              : item.image;

            return (
              <div
                key={item.id}
                style={
                  isEven
                    ? { marginTop: "20px", marginBottom: "20px" }
                    : { direction: "rtl" }
                }
                className="product_continer"
              >
                {mainImage ? (
                  <div className="product_continer_img">
                    <img
                      src={mainImage}
                      alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                      id="product-img"
                      onError={hideBrokenMainImage}
                    />
                  </div>
                ) : null}

                <div className="product_continer_text">
                  <div className="product_continer_text_data">
                    <h1>{language == "ar" ? item?.titleAr : item?.titleEn}</h1>
                    <p>
                      {language == "ar"
                        ? item?.descriptionAr
                        : item?.descriptionEn}
                    </p>
                    <div className="product_continer_text_data_img">
                      {item?.cattype?.map((itCat, indCat) => {
                        const brandName =
                          language == "ar"
                            ? itCat?.brand?.nameAr
                            : itCat?.brand?.nameEn;
                        const catName =
                          language == "ar" ? itCat?.name_ar : itCat?.name_en;
                        const imageSrc = getCategoryImage(
                          item,
                          itCat,
                          language
                        );

                        if (!imageSrc || !itCat?.brand?.id || !itCat?.category_id) {
                          return null;
                        }

                        const url = localizedPath(
                          `/brands/${itCat.brand.id}/categories/${itCat.category_id}?q=${itCat.category_id}`,
                          language
                        );

                        return (
                          <Link href={url} key={itCat.id || indCat}>
                            <img
                              src={imageSrc}
                              alt={
                                catName ||
                                brandName ||
                                (language == "ar"
                                  ? "صورة المنتج"
                                  : "Product Image")
                              }
                              style={{ cursor: "pointer" }}
                              onError={hideBrokenThumb}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProductType;
