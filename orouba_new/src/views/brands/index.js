"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import styled from "styled-components";
import { arrowLeftBrand, shadow } from "../../assets/svgIcons";
import UseGeneral from "../../hooks/useGeneral";
import CategoriesSlider from "../../layouts/reciepe/categories/brands";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";
import { localizedPath } from "@/utils/routes";

const StyledDiv = styled.div`
  color: white;

  &:hover {
    background-color: ${(props) => props.$hoverColor};
  }
`;

const Brands = ({ data, brandData, products, categoryId, brandId }) => {
  const { language } = UseGeneral();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);

  const brandName = language == "ar" ? brandData?.nameAr : brandData?.nameEn;
  const currentCategory = data?.find(item => item.id === categoryId);
  const brandCategoryName = language == "ar" ? currentCategory?.nameAr : currentCategory?.nameEn;

  const breadCrumbsArray = [
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "المنتجات" : "Brands" },
    {
      name: brandName,
      route: `/brands/${brandId}/categories/${categoryId}`,
    },
    {
      name: brandCategoryName,
      active: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "45px",
        marginBottom: "28px",
      }}
    >
      <CategoriesSlider data={data} breadCrumbsArray={breadCrumbsArray} brandId={brandId} currentCategoryId={categoryId} />
      <div className="rowDiv gridDiv">
        {products && products.length ? (
          <div className="brandsImages brandsImagesGrid brands_block">
            {products.map((itemRelation, index) => {
              const item = itemRelation.product;
              return (
                <StyledDiv
                  key={item.id}
                  className="receipe_block brand_block"
                  $hoverColor={brandData?.colorHover}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => router.push(localizedPath(`/products/${item.id}`, language))}
                >
                  <img src={item?.images?.[0]?.url} alt="" />
                  <div className="receipe_details brandShadow">
                    <span>{shadow}</span>
                    <div>
                      <h4>{language == "ar" ? item?.nameAr : item?.nameEn}</h4>
                      <div className="learnShadowMore">
                        <span>{language != "ar" ? "Learn More" : "المزيد"}</span>
                        <span
                          style={{
                            rotate: language == "ar" ? "180deg" : "0",
                            transition: "transform 0.3s",
                          }}
                        >
                          {arrowLeftBrand}
                        </span>
                      </div>
                    </div>
                  </div>
                </StyledDiv>
              );
            })}
          </div>
        ) : !products ? (
          <ThreeDots color="#035297" />
        ) : (
          <h3 style={{ margin: "20px auto" }}>
            {language == "ar" ? "لا توجد منتجات" : "No Products"}
          </h3>
        )}
      </div>
    </div>
  );
};

export default Brands;
