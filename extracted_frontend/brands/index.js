import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";

import { WhiteArrowLeft, arrowLeftBrand, shadow } from "../../assets/svgIcons";
import UseGeneral from "../../hooks/useGeneral";
import CategoriesSlider from "../../layouts/reciepe/categories/brands";
import "./style.css";
import axios from "axios";
import { base_url } from "../../consts";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

const StyledDiv = styled.div`
  color: white;

  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;

const Brands = () => {
  const { language } = UseGeneral();
  const navigate = useNavigate();
  const { brandId, brandName, brandCategoryName,id } = useParams();
  // console.log(id)
  const [params] = useSearchParams();
  const [data, setData] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [products, setProducts] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(arrowLeftBrand);
  const getData = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "brands/brand_categories/" + brandId
      );
      setData(homePageData?.data?.result);
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
    }
  };

  const getBrandData = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "brands/brand_details/" + brandId
      );
      setBrandData(homePageData?.data?.result);
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
    }
  };

  useEffect(() => {
    getBrandData();
  }, [brandId]);

  useEffect(() => {
    getData();
  }, []);

  const [breadCrumbsArray, setBreadCrumbsArray] = useState([
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "الوصفات" : "Recipes", active: true },
  ]);

  useEffect(() => {
    setBreadCrumbsArray([
      { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
      { name: language == "ar" ? "المنتجات" : "Brands" },
      {
        name: language == "ar" ? brandName : brandName,
        route: `/Brands/${brandId}`,
      },
      {
        name: language == "ar" ? brandCategoryName : brandCategoryName,
        active: true,
      },
    ]);
  }, [brandName, brandCategoryName]);

  const getSubCategories = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "categories/category_products/" + id
      );
      setProducts(homePageData?.data?.result);
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
      setProducts([]);
    }
  };

  const location = useLocation();

  useEffect(() => {
    setProducts(null);
    getSubCategories();
  }, [location]);

  return (
    <div
      style={{
        minHeight: "100vh",
        marginTop: "45px",
        marginBottom: "28px",
      }}
    >
      <CategoriesSlider data={data} breadCrumbsArray={breadCrumbsArray} />
      <div className="rowDiv gridDiv">
        {products && products.length ? (
          <div className="brandsImages brandsImagesGrid brands_block">
            {products.map((item, index) => (
              <StyledDiv
                key={index}
                className="receipe_block brand_block"
                hoverColor={brandData?.brand?.hover_color}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() =>
                  navigate(
                    "/brands/ProductType/ProductTypeCategory" +
                      "/" +
                      brandName +
                      "/" +
                      item?.id +
                      "/" +
                      brandId +
                      "/" +
                      (language == "ar"
                        ? data?.filter(
                            (item) => item?.id == params?.get("q")
                          )[0]?.name_ar
                        : data?.filter(
                            (item) => item?.id == params?.get("q")
                          )[0]?.name_en) +
                      "/" +
                      params?.get("q")
                  )
                }
              >
                <img src={item?.images[0]?.url} alt="" />
                <div className="receipe_details brandShadow">
                  <span>{shadow}</span>
                  <div>
                    <h4>{language == "ar" ? item?.name_ar : item?.name_en}</h4>
                    <Link className="learnShadowMore">
                      <span>{language != "ar" ? "Learn More" : "المزيد"}</span>
                      <span
                        style={{
                          rotate: language == "ar" ? "180deg" : "0",
                          transition: "transform 0.3s",
                        }}
                      >
                        {arrowLeftBrand}
                      </span>
                    </Link>
                  </div>
                </div>
              </StyledDiv>
            ))}
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
