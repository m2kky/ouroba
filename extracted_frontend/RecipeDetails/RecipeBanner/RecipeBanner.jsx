import React, { useEffect, useState } from "react";
import "./RecipeBanner.css";
import Breadcrumb from "../../../components/BreadCumbsLinks";
import UseGeneral from "../../../hooks/useGeneral";
import { ShareSocial } from "react-share-social";

const RecipeBanner = ({ data, breads }) => {
  const { language } = UseGeneral();

  const [pages, setPages] = useState([
    {
      name: language == "ar" ? "الرئيسية" : "Home",
      route: "/",
      active: true,
    },
    {
      name: language == "ar" ? "الوصفه" : "Recipe",
      route: "/Reciepe",
    },
    {
      name: language == "ar" ? "ملوخيه" : "Molokhia",
      // path:'/certifications',
    },
  ]);
  useEffect(() => {
    if (data) {
      setPages([
        {
          name: language == "ar" ? "الرئيسية" : "Home",
          route: "/",
          active: true,
        },
        {
          name: language == "ar" ? breads?.recName : breads?.recName,
          route: "/Reciepe?c=" + breads?.recId,
        },
        {
          name: language == "ar" ? breads?.foodName : breads?.foodName,
          route: "/Reciepe?c=" + breads?.recId + "&s_c=" + breads?.foodId,
        },
        {
          name: language == "ar" ? data?.name_ar : data?.name_en,
          // path:'/certifications',
        },
      ]);
    }
  }, [data]);
  const [isShare, setIsShare] = useState(false);
  return (
    <div className="recipe_banner">
      <div className="left">
        <Breadcrumb links={pages} />
        <div className="content">
          <h5>
            {language != "ar" ? <>{data?.name_en}</> : <>{data?.name_ar}</>}
          </h5>
          <button
            onClick={() => {
              setIsShare(!isShare);
            }}
          >
            <img src={require("../../../assets/share.png")} alt="" />
            <span>{language == "ar" ? "مشاركه" : "Share"}</span>
          </button>
        </div>
        {isShare ? (
          <div style={{ margin: "10px" }}>
            <ShareSocial
              url={window.location.href}
              socialTypes={[
                "facebook",
                "whatsapp",
                "twitter",
                "linkedin",
                "telegram",
                "reddit",
                "line",
                "instapaper",
                "hatena",
                "email",
                "livejournal",
                "ok",
                "mailru",
              ]}
              onSocialButtonClicked={(data) => console.log(data)}
            />
          </div>
        ) : null}
      </div>
      <h5 className="nameOfReciepe rowDiv" style={{ display: "none" }}>
        {language != "ar" ? <>{data?.name_en}</> : <>{data?.name_ar}</>}
      </h5>
      <div className="right">
        {data?.video_link ? (
          data?.video_link?.split(".")[
            data?.video_link?.split(".")?.length - 1
          ] == "mp4" ? (
            <video src={data?.video_link} loop muted autoPlay ></video>
          ) : (
            <img src={data?.video_link} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default RecipeBanner;
