import React, { useEffect, useState } from "react";
import "./style.css";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import Recips from "../../layouts/home/receips";
import ProductTypeSmallSlider from "../../layouts/home/receips/productTypeSmallSlider";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { base_url } from "../../consts";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
function ProductTypeCategory() {
  // const {brandId}=useParams
  const { language } = UseGeneral();
  const { id, brandId, categoryName, categoryId, brandName } = useParams();
  console.log(brandId, "brandId");
  const [data, setData] = useState();
  const getData = async () => {
    const data_send = {
      brand_id: brandId,
    };
    try {
      const homePageData = await axios.post(
        base_url + "products/product_details/" + id,
        data_send
      );
      console.log(homePageData);
      setData(homePageData?.data?.result);
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
    }
  };
  const [breadCrumbsArray, setBreadCrumbsArray] = useState([
    { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
    { name: language == "ar" ? "الوصفات" : "Recipes", active: true },
  ]);
  useEffect(() => {
    setBreadCrumbsArray([
      { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
      { name: language == "ar" ? "المنتجات" : "Brands" },
      {
        name: language != "ar" ? brandName : brandName,
        route: "/brands/" + brandId,
      },
      {
        name: language == "ar" ? categoryName : categoryName,
        route: `/Brands/${brandName}/${brandId}/${categoryId}/${categoryName}?q=${categoryId}`,
      },
      {
        name:
          language == "ar"
            ? data?.product_details?.name_ar
            : data?.product_details?.name_en,
        active: true,
      },
    ]);
  }, [data]);
  useEffect(() => {
    getData();
  }, []);
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
      ) : (
        <div
          className="downloadHeaderDiv products_types_page"
          style={{
            background: `${data && data?.product_details?.color}`,
          }}
        >
          <div
            className={`px-4 my-5 text-start downHeaderDiv `}
            style={{
              background: `${
                data && data?.product_details?.color
              }  url("https://res.cloudinary.com/duovxefh6/image/upload/v1716718777/pattern-1_kozbzs.png")`,
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
                      src={data?.product_details?.images[0]?.url}
                      alt=""
                      id="product-img"
                    />
                  </div>
                  <div className="product_continer_text">
                    <div className="product_continer_text_data productDetailsPage">
                      <h1>
                        {language == "ar"
                          ? data?.product_details?.name_ar
                          : data?.product_details?.name_en}
                      </h1>
                      {language == 'ar' ? (
                        data?.product_details?.description_ar && data?.product_details?.description_ar?.length ? (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: data?.product_details?.description_ar,
                            }}
                          ></p>
                        ) : null
                      ) : data?.product_details?.description_en &&
                        data?.product_details?.description_en?.length ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: data?.product_details?.description_en,
                          }}
                        ></p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data?.same_products && data?.same_products?.length ? (
            <ProductTypeSmallSlider
              brandId={brandId}
              type={data?.type}
              data={data?.same_products}
              withArrows={true}
            />
          ) : null}
          {data?.recipes && data?.recipes?.length ? (
            <Recips data={data?.recipes} withArrows={true} />
          ) : null}
        </div>
      )}
    </>
  );
}

export default ProductTypeCategory;
