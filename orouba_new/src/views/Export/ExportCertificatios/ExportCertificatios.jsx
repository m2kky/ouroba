"use client";
import React from "react";
import UseGeneral from "../../../hooks/useGeneral";
import ContentLoader from "react-content-loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import { localizedPath } from "@/utils/routes";
import RichText from "../../../components/RichText";

const localizedSetting = (settings, key, language) => {
  const value =
    language === "ar"
      ? settings?.[`${key}Ar`] || settings?.[key]
      : settings?.[`${key}En`] || settings?.[key];

  return typeof value === "string" ? value : "";
};

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="33"
    height="28"
    viewBox="0 0 33 28"
    fill="none"
  >
    <path
      d="M13.1895 8.13765L19.8101 13.7239L13.1895 19.3101"
      stroke="white"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExportCertificatios = ({ showTit, exportData, certificationsData = [] }) => {
  const { language } = UseGeneral();
  const router = useRouter();
  const certifications = Array.isArray(certificationsData)
    ? certificationsData.filter((item) => !item?.isHidden && item?.image)
    : [];
  const title = localizedSetting(exportData, "exportCertificationsTitle", language);
  const buttonText = localizedSetting(exportData, "exportCatalogButtonText", language);

  return (
    <div
      className={
        showTit
          ? "export_certificatios export_certificatios_page"
          : "export_certificatios min_mar export_certificatios_page"
      }
    >
      {showTit && title ? <RichText as="h4" html={title} /> : null}
      <div
        className={
          showTit
            ? "certifications hideFromMobile"
            : "certifications not_make_hide hideFromMobile"
        }
      >
        {certifications.map((item) => (
          <div className="certification" key={item.id}>
            <img src={item.image} alt="" />
          </div>
        ))}
      </div>

      <Swiper
        className={showTit ? "cert_swiper" : "cert_swiper make_hide"}
        style={{ width: "100%" }}
        breakpoints={{
          320: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1500: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {false ? (
          <ContentLoader />
        ) : certifications.length ? (
          certifications.map((item) => (
            <SwiperSlide key={item.id}>
              <img style={{ maxWidth: "100%" }} src={item.image} alt="" />
            </SwiperSlide>
          ))
        ) : null}
      </Swiper>

      {showTit && buttonText ? (
        <button
          className="hoverable certificationsHoverable"
          onClick={() => router.push(localizedPath("/export_cat", language))}
        >
          {buttonText}
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            <ArrowIcon />
          </span>
        </button>
      ) : null}
    </div>
  );
};

export default ExportCertificatios;
