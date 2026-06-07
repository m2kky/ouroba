"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";

const BRAND_LOGOS_BY_ID = {
  5: "/basma.png",
  7: "/farida.png",
};

const BRAND_LOGOS_BY_NAME = {
  basma: "/basma.png",
  "بسمة": "/basma.png",
  "بسمه": "/basma.png",
  farida: "/farida.png",
  "فريدة": "/farida.png",
  "فريده": "/farida.png",
};

const PRODUCT_TYPE_ORDER = {
  "frozen vegetables": 0,
  "frozen beans": 1,
  "frozen beans & grains": 1,
  "frozen fruits": 2,
  "pre-fried": 3,
  "frozen half fried": 3,
};

const normalizedTitle = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const hideBrokenMainImage = (event) => {
  const imageBox = event.currentTarget.closest(".product_continer_img");
  if (imageBox) {
    imageBox.style.display = "none";
  }
};

const hideBrokenThumb = (event) => {
  event.currentTarget.style.display = "none";
};

const getBrandLogo = (item) => {
  const brandId = item?.brand?.id != null ? String(item.brand.id) : "";
  const brandName = normalizedTitle(
    item?.brand?.nameEn ||
      item?.brand?.name_en ||
      item?.brand?.nameAr ||
      item?.brand?.name_ar
  );

  return (
    BRAND_LOGOS_BY_ID[brandId] ||
    BRAND_LOGOS_BY_NAME[brandName] ||
    item?.brand?.image ||
    item?.relation_image ||
    null
  );
};

const getBrandLogoOrder = (item) => {
  const brandId = item?.brand?.id != null ? String(item.brand.id) : "";
  const brandName = normalizedTitle(
    item?.brand?.nameEn ||
      item?.brand?.name_en ||
      item?.brand?.nameAr ||
      item?.brand?.name_ar
  );

  if (
    brandId === "7" ||
    brandName === "farida" ||
    brandName === "فريدة" ||
    brandName === "فريده"
  ) {
    return 0;
  }

  if (
    brandId === "5" ||
    brandName === "basma" ||
    brandName === "بسمة" ||
    brandName === "بسمه"
  ) {
    return 1;
  }

  return 2;
};

const isUnresolvedLegacyImage = (src) =>
  String(src || "").includes("camp-coding.site/eloroba/storage/app/images/");

function ProductType({ types, pageDataObj }) {
  const { language } = UseGeneral();
  const productTypeImage = pageDataObj?.product_type_img;
  const visibleTypes = Array.isArray(types)
    ? types
        .map((item, originalIndex) => ({ item, originalIndex }))
        .filter(({ item }) => {
          const title = normalizedTitle(item?.titleEn);
          return (
            title !== "products" &&
            item?.image &&
            Array.isArray(item?.cattype) &&
            item.cattype.length > 0
          );
        })
        .sort((a, b) => {
          const orderA = PRODUCT_TYPE_ORDER[normalizedTitle(a.item?.titleEn)] ?? 99;
          const orderB = PRODUCT_TYPE_ORDER[normalizedTitle(b.item?.titleEn)] ?? 99;
          return orderA - orderB || a.originalIndex - b.originalIndex;
        })
        .map(({ item }) => item)
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
            const imageLeft = index % 2 === 0;
            const mainImage = isUnresolvedLegacyImage(item.image)
              ? null
              : item.image;
            const brandLogoItems = Array.isArray(item?.cattype)
              ? item.cattype
                  .slice()
                  .sort((a, b) => getBrandLogoOrder(a) - getBrandLogoOrder(b))
              : [];

            return (
              <div
                key={item.id}
                style={
                  imageLeft
                    ? { marginTop: "20px", marginBottom: "20px" }
                    : undefined
                }
                className={`product_continer product-type-row ${
                  imageLeft
                    ? "product-type-row-image-left"
                    : "product-type-row-image-right"
                }`}
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
                    <div className="product_continer_text_data_img product-type-brand-logos">
                      {brandLogoItems.map((itCat, indCat) => {
                        const brandName =
                          language == "ar"
                            ? itCat?.brand?.nameAr
                            : itCat?.brand?.nameEn;
                        const catName =
                          language == "ar" ? itCat?.name_ar : itCat?.name_en;
                        const imageSrc = getBrandLogo(itCat);

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
