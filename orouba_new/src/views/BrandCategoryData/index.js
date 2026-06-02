"use client";
import React from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import WhyUs from "../../layouts/BrandCategoryData/whyUs";
import Recips from './../../layouts/BrandCategoryData/receips/index';

const BrandCategoryData = ({ data, id }) => {
  const { language } = UseGeneral();

  const breadCrumbsArray = [
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "المنتجات" : "Brands" },
    {
      name: language == "ar" ? data?.brand?.nameAr : data?.brand?.nameEn,
      active: true,
    },
  ];

  return (
    <>
      <div
        style={{ minHeight: "30vh", marginTop: "45px" }}
        className="brandOncategory"
      >
        <Breadcrumb links={breadCrumbsArray} />
        <div
          className="boxShadowSection BrandsShadowSection"
          style={{ background: data?.brand?.color }}
        >
          <WhyUs data={data} id={id}/>
          <Recips data={data} type={"brands"} />
        </div>
      </div>
    </>
  );
};

export default BrandCategoryData;
