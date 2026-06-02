"use client";
import React from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import Recips from "../../layouts/home/receips";
import ProductTypeSmallSlider from "../../layouts/home/receips/productTypeSmallSlider";

function ProductTypeCategory({ data, breads, sameProducts, recipes, brandId }) {
  const { language } = UseGeneral();

  const breadCrumbsArray = [
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "المنتجات" : "Brands" },
    {
      name: language != "ar" ? breads.brandNameEn : breads.brandNameAr,
      route: "/brands/" + breads.brandId,
    },
    {
      name: language == "ar" ? breads.categoryNameAr : breads.categoryNameEn,
      route: `/brands/${breads.brandId}/${breads.categoryId}`,
    },
    {
      name: language == "ar" ? data?.nameAr : data?.nameEn,
      active: true,
    },
  ];

  return (
    <div
      className="downloadHeaderDiv products_types_page"
      style={{
        background: `${data?.color}`,
      }}
    >
      <div
        className={`px-4 my-5 text-start downHeaderDiv `}
        style={{
          background: `${data?.color} url("https://res.cloudinary.com/duovxefh6/image/upload/v1716718777/pattern-1_kozbzs.png")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          backgroundSize: "100%",
        }}
      >
        <div className="rowDiv">
          <Breadcrumb links={breadCrumbsArray} />
          <div className="products_types_info" id="products_types_info">
            <div className="product_continer">
              <div className="product_continer_img product_type_img">
                <img
                  src={data?.images?.[0]?.url}
                  alt=""
                  id="product-img"
                />
              </div>
              <div className="product_continer_text">
                <div className="product_continer_text_data productDetailsPage">
                  <h1>{language == "ar" ? data?.nameAr : data?.nameEn}</h1>
                  {language == 'ar' ? (
                    data?.descriptionAr && data?.descriptionAr?.length ? (
                      <p dangerouslySetInnerHTML={{ __html: data?.descriptionAr }}></p>
                    ) : null
                  ) : data?.descriptionEn && data?.descriptionEn?.length ? (
                    <p dangerouslySetInnerHTML={{ __html: data?.descriptionEn }}></p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {sameProducts && sameProducts?.length ? (
        <ProductTypeSmallSlider
          brandId={brandId}
          data={sameProducts}
          withArrows={true}
        />
      ) : null}
      {recipes && recipes?.length ? (
        <Recips data={recipes} withArrows={true} />
      ) : null}
    </div>
  );
}

export default ProductTypeCategory;
