"use client";
import React from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import Link from 'next/link';
import { localizedPath } from "@/utils/routes";

function ProductType({ types, pageDataObj }) {
  const { language } = UseGeneral();
  const productTypeImage = pageDataObj?.product_type_img;

  return (
    <>
      <div className={`px-4 my-5 text-start downHeaderDiv rowDiv`}>
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
          {types &&
            types.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  style={isEven ? { marginTop: "20px", marginBottom: "20px" } : { direction: "rtl" }}
                  className="product_continer"
                >
                  <div className="product_continer_img">
                    <img
                      src={item.image}
                      alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                      id="product-img"
                    />
                  </div>
                  <div className="product_continer_text">
                    <div className="product_continer_text_data">
                      <h1>{language == "ar" ? item?.titleAr : item?.titleEn}</h1>
                      <p>{language == "ar" ? item?.descriptionAr : item?.descriptionEn}</p>
                      <div className="product_continer_text_data_img">
                        {item?.cattype &&
                          item?.cattype.map((itCat, indCat) => {
                            const brandName = language == "ar" ? itCat?.brand?.nameAr : itCat?.brand?.nameEn;
                            const catName = language == "ar" ? itCat?.name_ar : itCat?.name_en;
                            const url = localizedPath(
                              `/brands/${itCat?.brand?.id}/categories/${itCat?.category_id}?q=${itCat?.category_id}`,
                              language
                            );

                            return (
                              <Link href={url} key={indCat}>
                                <img
                                  src={language === "ar" ? itCat?.image : (itCat?.image_en || itCat?.image)}
                                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                                  style={{ cursor: "pointer" }}
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
