import React, { useEffect, useState } from "react";
import "./style.css";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../consts";
import { ThreeDots } from "react-loader-spinner";

function ProductType() {
  const { language } = UseGeneral();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageLoading2, setPageLoading2] = useState(false);
  const [types, setTypes] = useState([]);
  const [pageDataObj, setPageDataObj] = useState({});
  const getTypes = () => {
    setPageLoading(true);
    axios
      .get(base_url + `category_types/get_all`)
      .then((res) => {
        if (Array.isArray(res.data.result)) {
          setTypes(res.data.result);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  };
  const getProdTypeText = () => {
    setPageLoading2(true);
    axios
      .get(base_url + `pages/product_type`)
      .then((res) => {
        if (res.data.status == "success") {
          setPageDataObj(res.data.result);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading2(false);
      });
  };
  useEffect(() => {
    getTypes();
    getProdTypeText();
  }, []);
  return (
    <>
      {pageLoading || pageLoading2 ? (
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThreeDots color="#236bab" />
        </div>
      ) : (
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
              style={{
                backgroundImage: `url(${pageDataObj?.product_type_img})`,
              }}
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
                  if (index % 2 == 0) {
                    return (
                      <div
                        style={{ marginTop: "20px", marginBottom: "20px" }}
                        className="product_continer"
                      >
                        <div className="product_continer_img">
                          <img
                            src={item.image}
                            alt={
                              language == "ar" ? "صورة المنتج" : "Product Image"
                            }
                            id="product-img"
                          />
                        </div>
                        <div className="product_continer_text">
                          <div className="product_continer_text_data">
                            <h1>
                              {language == "ar"
                                ? item?.title_ar
                                : item?.title_en}
                            </h1>
                            <p>
                              {language == "ar"
                                ? item?.description_ar
                                : item?.description_en}
                            </p>
                            <div className="product_continer_text_data_img">
                              {item?.cattype &&
                                item?.cattype.map((itCat, indCat) => {
                                  return (
                                    <img
                                      src={itCat?.image}
                                      alt={
                                        language == "ar"
                                          ? "صورة المنتج"
                                          : "Product Image"
                                      }
                                      onClick={() => {
                                        window.location.href = `/Brands/${
                                          language == "ar"
                                            ? itCat?.brand.name_ar
                                            : itCat?.brand.name_en
                                        }/${itCat?.brand.id}/${
                                          itCat?.category_id
                                        }/${
                                          language == "ar"
                                            ? itCat?.name_ar
                                            : itCat?.name_en
                                        }%20?q=${itCat?.category_id}`;
                                        // navigate("/Brands/Basma/5/11/Frozen%20Vegetables%20&%20Fruits?q=11")
                                      }}
                                    />
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="product_continer"
                        style={{ direction: "rtl" }}
                      >
                        <div className="product_continer_img">
                          <img
                            src={item.image}
                            alt={
                              language == "ar" ? "صورة المنتج" : "Product Image"
                            }
                            id="product-img"
                          />
                        </div>
                        <div className="product_continer_text">
                          <div className="product_continer_text_data">
                            <h1>
                              {language == "ar"
                                ? item?.title_ar
                                : item?.title_en}
                            </h1>
                            <p>
                              {language == "ar"
                                ? item?.description_ar
                                : item?.description_en}
                            </p>
                            <div className="product_continer_text_data_img">
                              {item?.cattype &&
                                item?.cattype.map((itCat, indCat) => {
                                  return (
                                    <img
                                      src={itCat.image}
                                      alt={
                                        language == "ar"
                                          ? "صورة المنتج"
                                          : "Product Image"
                                      }
                                      onClick={() => {
                                        // navigate("/Brands/Basma/5/11/Frozen%20Vegetables%20&%20Fruits?q=11")
                                        window.location.href = `/Brands/${
                                          language == "ar"
                                            ? itCat?.brand.name_ar
                                            : itCat?.brand.name_en
                                        }/${itCat?.brand.id}/${
                                          itCat?.category_id
                                        }/${
                                          language == "ar"
                                            ? itCat?.name_ar
                                            : itCat?.name_en
                                        }%20?q=${itCat?.category_id}`;
                                      }}
                                    />
                                  );
                                })}
                              {/* <img
                      src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716720708/Farida_Logo_CMYK_final_copy_y3hpi2.png"}
                      alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                      onClick={() =>
                        navigate("/Brands/Farida/7/4/Frozen%20Vegetables?q=4")
                      }
                    /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

              {/*
        <div className="product_continer">
          <div className="product_continer_img">
            <img
              src={require("./img/IMG-20240504-WA0010.png")}
              alt={language == "ar" ? "صورة المنتج" : "Product Image"}
              id="product-img"
            />
          </div>
          <div className="product_continer_text">
            <div className="product_continer_text_data">
              <h1>
                {language == "ar" ? "الخضروات المجمدة" : "Frozen Vegetables"}
              </h1>
              <p>
                {language == "ar"
                  ? "جميع خضرواتنا مختارة بعناية. تخضع لعملية التفتيش، ثم تُغسل الخضروات وتُعالج وتُجمد بسرعة. لدينا مجموعة كبيرة من الأنواع ونسعى لزيادتها"
                  : "All our vegetables are carefully selected. They undergo inspection process, then the vegetables are washed, processed and quick frozen. We have a large variety of types and we aim at increasing them"}
              </p>
              <div className="product_continer_text_data_img">
                <img
                  src={require("./img/IMG-20240504-WA0013.png")}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Basma/5/11/Frozen%20Vegetables%20&%20Fruits?q=11")
                  }
                />
                <img
                  src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716720708/Farida_Logo_CMYK_final_copy_y3hpi2.png"}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Farida/7/4/Frozen%20Vegetables?q=4")
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="product_continer" style={{ direction: 'rtl' }}>
          <div className="product_continer_img">
            <img
              src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716720791/2_nlkmgc.png"}
              alt={language == "ar" ? "صورة المنتج" : "Product Image"}
              id="product-img"
            />
          </div>
          <div className="product_continer_text">
            <div className="product_continer_text_data">
              <h1>{language == "ar" ? "الفواكه المجمدة" : "Frozen Fruits"}</h1>
              <p>
                {language == "ar"
                  ? "يتم اختيار الفواكه الطازجة ومعالجتها، ثم يتم تجميدها بسرعة للحفاظ على جميع خصائصها"
                  : "Fresh fruits are selected and processed, then quick frozen to keep all their attributes"}
              </p>
              <div className="product_continer_text_data_img">
                <img
                  src={require("./img/IMG-20240504-WA0013.png")}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Basma/5/11/Frozen%20Vegetables%20&%20Fruits?q=11")
                  }
                />
                <img
                  src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716720708/Farida_Logo_CMYK_final_copy_y3hpi2.png"}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Farida/7/5/Frozen%20Fruits?q=5")
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="product_continer">
          <div className="product_continer_img">
            <img
              src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716721114/f2_1_nfdgrq.png"}
              alt={language == "ar" ? "صورة المنتج" : "Product Image"}
              id="product-img"
            />

          </div>
          <div className="product_continer_text">
            <div className="product_continer_text_data">
              <h1>{language == "ar" ? "الفاصوليا المجمدة" : "Frozen Beans"}</h1>
              <p>
                {language == "ar"
                  ? "تُختار الفاصوليا لدينا، وتُغلى لتوفير الكثير من الوقت. الكثير منها جاهز للأكل والبعض يحتاج حوالي 10 دقائق من التسخين."
                  : "Our beans are selected, boiled to save a whole lot of time. Many of which are ready to eat and some take around 10 minutes of heating."}
              </p>
              <div className="product_continer_text_data_img">
                <img
                  src={require("./img/IMG-20240504-WA0013.png")}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Basma/5/13/Frozen%20Beans%20(Boiled)?q=13")
                  }
                />

              </div>
            </div>
          </div>
        </div>
        <div className="product_continer"  style={{ direction: 'rtl' }}>
          <div className="product_continer_img">
            <img
              src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716719553/web_copy_dlfqpg.png"}
              alt={language == "ar" ? "صورة المنتج" : "Product Image"}
              id="product-img"
            />
          </div>
          <div className="product_continer_text">
            <div className="product_continer_text_data">
              <h1>
                {language == "ar" ? "نصف مقلية مجمدة" : "Frozen Half Fried"}
              </h1>
              <p>
                {language == "ar"
                  ? "لدينا أنواع الفلافل الشهيرة لدينا، بالإضافة إلى وصفاتنا الأصلية من شرائح البطاطس / السبانخ وزهيرات القرنبيط المغطاة بالبقسماط."
                  : "We have our famous Falafel types, in addition to our original recipes of potatoes / spinach strips and cauliflower breaded florets."}
              </p>
              <div className="product_continer_text_data_img">
                <img
                  src={require("./img/IMG-20240504-WA0013.png")}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Basma/5/14/Frozen%20Pre-Fried%20Bites?q=14")
                  }
                />
                  <img
                  src={"https://res.cloudinary.com/duovxefh6/image/upload/v1716720708/Farida_Logo_CMYK_final_copy_y3hpi2.png"}
                  alt={language == "ar" ? "صورة المنتج" : "Product Image"}
                  onClick={() =>
                    navigate("/Brands/Farida/7/6/Frozen%20Flafel?q=6")
                  }
                />
              </div>
            </div>
          </div>
        </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductType;
