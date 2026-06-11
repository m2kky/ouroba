"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";
import RichText from "../../components/RichText";

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
  "frozen fruits": 0,
  "frozen fruit": 0,
  "الفواكه المجمدة": 0,
  "الفواكة المجمدة": 0,
  "pre-fried": 1,
  "pre fried": 1,
  "frozen pre-fried": 1,
  "frozen half fried": 1,
  "half fried": 1,
  "النصف مقلي": 1,
  "نصف مقلي": 1,
  "frozen vegetables": 2,
  "frozen vegetable": 2,
  "الخضروات المجمدة": 2,
  "frozen beans": 3,
  "frozen beans & grains": 3,
  "frozen beans and grains": 3,
  "frozen legumes": 3,
  "frozen legumes & grains": 3,
  "frozen legumes and grains": 3,
  "البقوليات والحبوب المجمدة": 3,
  "البقوليات المجمدة": 3,
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

const getProductTypeOrder = (item) => {
  const titles = [
    item?.titleEn,
    item?.title_en,
    item?.titleAr,
    item?.title_ar,
  ].map(normalizedTitle);

  for (const title of titles) {
    if (title in PRODUCT_TYPE_ORDER) {
      return PRODUCT_TYPE_ORDER[title];
    }
  }

  return 99;
};

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
          const orderA = getProductTypeOrder(a.item);
          const orderB = getProductTypeOrder(b.item);
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
            <RichText
              html={
                language == "ar"
                  ? pageDataObj?.product_type_text_ar
                  : pageDataObj?.product_type_text_en
              }
              style={{
                color: "#002F59",
                width: "80%",
                fontSize: "18px",
                marginTop: "16px",
              }}
            />
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
                    <RichText
                      html={
                        language == "ar"
                          ? item?.descriptionAr
                          : item?.descriptionEn
                      }
                    />
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
