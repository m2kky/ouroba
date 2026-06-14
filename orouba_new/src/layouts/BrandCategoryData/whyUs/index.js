"use client";
import React from "react";
import UseGeneral from "../../../hooks/useGeneral";
import Link from "next/link";
import { WhiteArrowLeft } from "../../../assets/svgIcons";
import { localizedPath } from "@/utils/routes";
import RichText from "../../../components/RichText";

const isVideoMedia = (src) =>
  typeof src === "string" && /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(src);

const pickBrandMedia = (brand, language) => {
  const candidates =
    language === "ar"
      ? [
          brand?.videoUrl,
          brand?.videoUrlEn,
          brand?.imageMain,
          brand?.imageSmallMain,
          brand?.imageSmall,
        ]
      : [
          brand?.videoUrlEn,
          brand?.videoUrl,
          brand?.imageMain,
          brand?.imageSmallMain,
          brand?.imageSmall,
        ];

  return candidates.find((src) => typeof src === "string" && src.trim()) || null;
};

function WhyUs({ data, id }) {
  const { language } = UseGeneral();
  const mediaSrc = pickBrandMedia(data?.brand, language);
  const brandDescription =
    language == "ar" ? data?.brand?.descriptionAr : data?.brand?.descriptionEn;
  const brandText =
    language == "ar" ? data?.brand?.brandTextAr : data?.brand?.brandTextEn;
  return (
    <div className="hero_section d-flex flex-column justify-content-between align-items-center w-full rowDiv why_us_section brands_section">
      {mediaSrc && isVideoMedia(mediaSrc) ? (
        <video
          style={{ width: "100%", margin: "auto" }}
          src={mediaSrc}
          muted
          autoPlay
          loop
        ></video>
      ) : mediaSrc ? (
        <img src={mediaSrc} alt={language === "ar" ? data?.brand?.nameAr : data?.brand?.nameEn} />
      ) : null}
      <RichText as="p" html={brandDescription} style={{ color: "white" }} />
      {brandText ? (
        <div className="brand-detail-quote" aria-label={language === "ar" ? "نص تفصيلي" : "Detailed text"}>
          <RichText
            as="div"
            html={brandText}
            className="brand-detail-quote-text"
          />
        </div>
      ) : null}
      {String(id) === "8" ? (
        <Link
          className="btn btn-primary viewAllBtn"
          href={localizedPath("/brands/5/categories/14?q=14", language)}
          style={{ marginBottom: "113px" }}
        >
          <span>{language != "ar" ? "View All" : "إظهار الكل"}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {WhiteArrowLeft}
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export default WhyUs;

