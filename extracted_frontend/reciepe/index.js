import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { arrowLeft, group } from "../../assets/svgIcons";
import IconWithText from "../../components/iconWithText";
import UseGeneral from "../../hooks/useGeneral";
import { ThreeDots } from "react-loader-spinner";
import CategoriesSlider from "../../layouts/reciepe/categories";
import "./style.css";
import toast from "react-hot-toast";
import { base_url } from "../../consts";
import axios from "axios";

const Reciepe = () => {
  const { language } = UseGeneral();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [cooks, setCooks] = useState(null);
  const [pageLoading, setPageLoading] = useState(null);
  const [recs, setRecs] = useState(null);
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    if (
      (!params.get("s_c") ||
        !params.get("s_c")?.length ||
        params.get("s_c") == "undefined") &&
      data &&
      data?.length &&
      recs &&
      recs?.length
    ) {
      // Reset cooks to null on category click
      setCooks(null);
      const newParams = new URLSearchParams(params.toString());
      newParams.set("c", params?.get("c"));
      newParams.set("s_c", recs && recs[0]?.id?.toString());
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [recs, data, language]);

  const handleCategoryClick = async (id) => {
    setCooks(null);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("c", params?.get("c"));
    newParams.set("s_c", id);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const getRecs = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "recipes/get_recipe_foods/" + params.get("c")
      );
      setRecs(homePageData?.data?.result);
    } catch (err) {
      setRecs([]);
      toast.error("Error Get Data");
    }
  };
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [selectedRecName, setSelectedRecName] = useState(null);
  useEffect(() => {
    if (params.get("c")) {
      getRecs();
      setSelectedRecName(
        language == "ar"
          ? data?.filter((item) => item?.id == params.get("c"))[0]?.name_ar
          : data?.filter((item) => item?.id == params.get("c"))[0]?.name_en
      );
    }
  }, [params.get("c"), data, language]);

  useEffect(() => {
    if (cooks && cooks?.length && params.get("s_c")) {
      setSelectedCategoryName(
        language == "ar"
          ? recs?.filter((item) => item?.id == params.get("s_c"))[0]?.name_ar
          : recs?.filter((item) => item?.id == params.get("s_c"))[0]?.name_en
      );
    }
  }, [params.get("s_c"), cooks, language]);

  // useEffect(() => {
  //   setCooks(null);
  // }, [params]);

  const getReieps = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "foods/get_food_cooks/" + params.get("s_c")
      );
      setCooks(homePageData?.data?.result);
      setPageLoading(false);
    } catch (err) {
      setCooks([]);
      setPageLoading(false);
      toast.error("Error Get Data");
    }
  };

  useEffect(() => {
    if (params.get("s_c")) {
      getReieps();
    }
  }, [params.get("s_c"), recs, language]);

  useEffect(() => {
    if (data && data?.length && !params.get("c")) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set("c", data && data[0]?.id);
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [data, language]);

  const getData = async () => {
    try {
      setPageLoading(true);
      const homePageData = await axios.get(base_url + "recipes/get_for_user");
      setData(homePageData?.data?.result);
    } catch (err) {
      setData([]);
      toast.error("Error Get Data");
    }
  };

  useEffect(() => {
    getData();
  }, [language]);
  const [openCategoriesMenu, setOpenCategoriesMenu] = useState(false);
  return (
    <>
      {pageLoading ? (
        <div
          className="rowDiv brandsImagesSlider"
          style={{
            minHeight: "400px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ThreeDots color="#035297" />
        </div>
      ) : (
        <div
          style={{
            minHeight: "100vh",
            marginTop: "45px",
            marginBottom: "28px",
          }}
        >
          <CategoriesSlider data={language =="en" ? data : data} setRecs={setRecs} setCooks={setCooks} />
          {data && data?.length ? (
            <h2 className="rowDiv categoryName">
              {console.log(data)}
              {language == "ar"
                ? data?.filter((item) => item?.id == params.get("c"))[0]
                    ?.name_ar
                : data?.filter((item) => item?.id == params.get("c"))[0]
                    ?.name_en}
            </h2>
          ) : null}
          {data && data?.length ? (
            <>
              {!recs ? (
                <div className="rowDiv">
                  <ThreeDots color="#035297" />
                </div>
              ) : recs?.length ? (
                <div className="rowDiv gridDiv">
                  <div className="rec_name rowDiv">
                    <h3
                      style={{ color: "var(--main-color)" }}
                      onClick={() => setOpenCategoriesMenu(!openCategoriesMenu)}
                    >
                      {language == "ar"
                        ? recs?.filter(
                            (item) => item?.id == params.get("s_c")
                          )[0]?.name_ar
                        : recs?.filter(
                            (item) => item?.id == params.get("s_c")
                          )[0]?.name_en}{" "}
                      <span
                        style={{
                          rotate: openCategoriesMenu ? "90deg" : "0deg",
                          transition: "0.5s ease-in-out",
                        }}
                      >
                        {" "}
                        {arrowLeft}
                      </span>
                    </h3>
                  </div>
                  <div
                    className={
                      openCategoriesMenu
                        ? "sidebar_reciepe open"
                        : "sidebar_reciepe"
                    }
                  >
                    {!recs ? (
                      <ThreeDots color="#FFF100" />
                    ) : recs?.length ? (
                      recs?.map((item) => (
                        <span
                          key={item?.id}
                          className={
                            item?.id == params?.get("s_c")
                              ? `receipeName active`
                              : `receipeName`
                          }
                          onClick={() => {
                            if (item?.id != params.get("s_c")) {
                              setOpenCategoriesMenu(!openCategoriesMenu);
                              handleCategoryClick(item?.id);
                            }
                          }}
                        >
                          {language == "ar" ? item?.name_ar : item?.name_en}
                        </span>
                      ))
                    ) : null}
                  </div>
                  {!cooks ? (
                    <div className="rowDiv">
                      <ThreeDots color="#035297" />
                    </div>
                  ) : cooks?.length ? (
                    <div className="brandsImages brandsImagesGrid">
                      {cooks?.map((item, index) => (
                        <div
                          key={index}
                          className="receipe_block"
                          onClick={() =>
                            navigate(
                              `/recipe_details/${item.id}/${selectedRecName}/${params.get(
                                "c"
                              )}/${selectedCategoryName}/${params.get(
                                "s_c"
                              )}?id=${item?.id}`
                            )
                          }
                        >
                          <div className="item_row">
                            <img src={item?.images[0]?.url} alt="" />
                          </div>
                          <div className="receipe_details">
                            <h4 style={{ textAlign: "center" }}>
                              {language == "ar" ? item?.name_ar : item?.name_en}
                            </h4>
                            {/* {item?.props && item?.props?.length ? (
                              <div className="rowDiv">
                                <IconWithText
                                  img={true}
                                  icon={item?.props[3]?.icon}
                                  text={
                                    language == "ar"
                                      ? item?.props[3]?.text_ar
                                      : item?.props[3]?.text_en
                                  }
                                />
                                <IconWithText
                                  img={true}
                                  icon={item?.props[2]?.icon}
                                  text={
                                    language == "ar"
                                      ? item?.props[2]?.text_ar
                                      : item?.props[2]?.text_en
                                  }
                                />
                              </div>
                            ) : (
                              <div className="rowDiv">
                                <IconWithText
                                  img={true}
                                  icon={""}
                                  text={language != "ar" ? "" : ""}
                                />
                                <IconWithText
                                  img={true}
                                  icon={""}
                                  text={language == "ar" ? " " : ""}
                                />
                              </div>
                            )} */}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rowDiv">
                      <h3 style={{ fontSize: "23px", margin: "20px auto" }}>
                        No Recieps
                      </h3>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rowDiv">
                  <h3 style={{ fontSize: "23px", margin: "20px auto" }}>
                    No Foods
                  </h3>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </>
  );
};

export default Reciepe;
