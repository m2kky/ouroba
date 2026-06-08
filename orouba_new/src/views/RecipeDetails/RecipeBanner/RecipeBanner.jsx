"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/BreadCumbsLinks";
import UseGeneral from "../../../hooks/useGeneral";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
  XShareButton,
} from "react-share";

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const isVideoFile = (src) => /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(src || "");

const RecipeBanner = ({ data, breads }) => {
  const { language } = UseGeneral();

  const [pages, setPages] = useState([]);
  useEffect(() => {
    if (data) {
      setPages([
        {
          name: language == "ar" ? "الرئيسية" : "Home",
          route: "/",
          active: true,
        },
        {
          name: language == "ar" ? breads?.recNameAr : breads?.recName,
          route: "/recipes?c=" + breads?.recId,
        },
        {
          name: language == "ar" ? breads?.foodNameAr : breads?.foodName,
          route: "/recipes?c=" + breads?.recId + "&s_c=" + breads?.foodId,
        },
        {
          name: language == "ar" ? data?.nameAr : data?.nameEn,
        },
      ]);
    }
  }, [data, language, breads]);
  
  const [isShare, setIsShare] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = language == "ar" ? data?.nameAr : data?.nameEn;
  const videoSrc = first(data?.videoLink, data?.video_link);
  const imageSrc = first(
    data?.internalImage,
    data?.internal_image,
    data?.images?.[0]?.url,
    data?.image
  );
  const mediaSrc = isVideoFile(videoSrc) ? videoSrc : first(imageSrc, videoSrc);
  
  return (
    <div className="recipe_banner">
      <div className="left">
        <Breadcrumb links={pages} />
        <div className="content">
          <h5>
            {language != "ar" ? <>{data?.nameEn}</> : <>{data?.nameAr}</>}
          </h5>
          <button
            onClick={() => {
              setIsShare(!isShare);
            }}
          >
            <span>{language == "ar" ? "مشاركه" : "Share"}</span>
          </button>
        </div>
        {isShare ? (
          <div style={{ display: "flex", gap: "8px", margin: "10px" }}>
            <FacebookShareButton url={shareUrl} aria-label="Share on Facebook">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton
              title={shareTitle}
              url={shareUrl}
              aria-label="Share on WhatsApp"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <XShareButton
              title={shareTitle}
              url={shareUrl}
              aria-label="Share on X"
            >
              <XIcon size={32} round />
            </XShareButton>
            <LinkedinShareButton
              title={shareTitle}
              url={shareUrl}
              aria-label="Share on LinkedIn"
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton
              subject={shareTitle}
              url={shareUrl}
              aria-label="Share by email"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        ) : null}
      </div>
      <h5 className="nameOfReciepe rowDiv" style={{ display: "none" }}>
        {language != "ar" ? <>{data?.nameEn}</> : <>{data?.nameAr}</>}
      </h5>
      <div className="right">
        {mediaSrc ? (
          isVideoFile(mediaSrc) ? (
            <video src={mediaSrc} loop muted autoPlay playsInline></video>
          ) : (
            <img src={mediaSrc} alt={shareTitle || ""} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default RecipeBanner;
