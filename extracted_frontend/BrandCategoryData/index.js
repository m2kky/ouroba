import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";

import "./style.css";
import WhyUs from "../../layouts/BrandCategoryData/whyUs";
import Recips from './../../layouts/BrandCategoryData/receips/index';
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { base_url } from "../../consts";
import { ThreeDots } from "react-loader-spinner";
const BrandCategoryData = () => {
  const { language } = UseGeneral();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "brands/brand_details/" + id
      );
      setData(homePageData?.data?.result);
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
    }
  };
  useEffect(() => {
    if (id) getData();
  }, [id]);
  const [breadCrumbsArray, setBreadCrumbsArray] = useState([
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "الوصفات" : "Recipes", active: true },
  ]);
  useEffect(() => {
    setBreadCrumbsArray([
      { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
      { name: language == "ar" ? "المنتجات" : "Brands" },
      {
        name: language == "ar" ? data?.brand?.name_ar: data?.brand?.name_en,
        active: true,
      },
    ]);
  }, [data]);
  return (
    <>
    {" "}
    {!data ? (
      <div
        className="rowDiv"
        style={{
          minHeight: "50vh",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThreeDots color="var(--main-color" />
      </div>
    ) : <div
      style={{ minHeight: "30vh", marginTop: "45px" }}
      className="brandOncategory"
    >
      <Breadcrumb links={breadCrumbsArray} />
      <div
        className="boxShadowSection BrandsShadowSection"
        style={{ background: data?.brand?.color }}
      >
        <WhyUs data={data} id={id}/>
        {/* <Standards /> */}
        <Recips data={data} type={"brands"} />
      </div>
    </div>}</>
  );
};

export default BrandCategoryData;
