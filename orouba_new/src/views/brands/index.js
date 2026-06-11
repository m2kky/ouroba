"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import styled from "styled-components";
import { arrowLeftBrand, shadow } from "../../assets/svgIcons";
import UseGeneral from "../../hooks/useGeneral";
import CategoriesSlider from "../../layouts/reciepe/categories/brands";
import { ThreeDots } from "react-loader-spinner";
import { localizedPath } from "@/utils/routes";

const StyledDiv = styled.div`
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${(props) => props.$hoverColor};
  }

  &:hover h4,
  &:hover .learnShadowMore,
  &:hover .learnShadowMore span {
    color: ${(props) => props.$hoverTextColor} !important;
  }

  &:hover .learnShadowMore svg path {
    stroke: currentColor !important;
  }
`;

const normalizeColor = (value) =>
  typeof value === "string" ? value.trim() : "";

const isDefaultHoverColor = (value) =>
  ["#eee", "#eeeeee"].includes(value.toLowerCase());

const resolveBrandHoverColor = (brand) => {
  const colors = [brand?.colorBrand, brand?.color, brand?.colorHover]
    .map(normalizeColor)
    .filter(Boolean);

  return colors.find((color) => !isDefaultHoverColor(color)) || colors[0] || "#035297";
};

const getHoverTextColor = (color) => {
  const hex = normalizeColor(color).replace("#", "");

  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) {
    return "#ffffff";
  }

  const fullHex =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;

  const red = parseInt(fullHex.slice(0, 2), 16);
  const green = parseInt(fullHex.slice(2, 4), 16);
  const blue = parseInt(fullHex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? "#002f59" : "#ffffff";
};

const Brands = ({ data, brandData, products, categoryId, brandId }) => {
  const { language } = UseGeneral();
  const router = useRouter();

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
            {products.map((itemRelation) => {
              const item = itemRelation.product;
              const itemBrand = itemRelation?.brand || item?.brand || brandData;
              const brandHoverColor = resolveBrandHoverColor(itemBrand);
              const brandHoverTextColor = getHoverTextColor(brandHoverColor);

              return (
                <StyledDiv
                  key={item.id}
                  className="receipe_block brand_block"
                  $hoverColor={brandHoverColor}
                  $hoverTextColor={brandHoverTextColor}
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
