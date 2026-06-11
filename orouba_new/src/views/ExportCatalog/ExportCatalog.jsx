"use client";
import React from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import ExportForm from "../Export/ExportForm/ExportForm";
import UseGeneral from "../../hooks/useGeneral";
import RichText from "../../components/RichText";

const localizedSetting = (settings, key, language) => {
  const value =
    language === "ar"
      ? settings?.[`${key}Ar`] || settings?.[key]
      : settings?.[`${key}En`] || settings?.[key];

  return typeof value === "string" ? value : "";
};

const ExportCatalog = ({ exportCatData }) => {
  const { language } = UseGeneral();
  const title = localizedSetting(exportCatData, "catalogTitle", language);
  const text =
    localizedSetting(exportCatData, "catalog", language) ||
    localizedSetting(exportCatData, "catalogText", language);
  const buttonText =
    localizedSetting(exportCatData, "catalogButtonText", language) ||
    localizedSetting(exportCatData, "exportCatalogButtonText", language);

  const pages = [
    {
      name: language == "ar" ? "الصفحة الرئيسية" : "Home",
      title_ar: "الصفحة الرئيسية",
      title_en: "Home",
      route: "/",
    },
    {
      name: language == "ar" ? "كتالوج التصدير" : "Export Catalogue",
      title_ar: "كتالوج التصدير",
      title_en: "Export Catalogue",
      active: true,
    },
  ];

  return (
    <div className="export_catalog_page">
      <Breadcrumb links={pages} />
      <div className="cat_expo_ban rowDiv">
        <div className="left">
          {title ? <h5>{title}</h5> : null}
          <RichText html={text} />
          {exportCatData?.catalogFile && buttonText ? (
            <em
              className="btn btn-primary"
              onClick={() => window.open(exportCatData.catalogFile, "_blank")}
              style={{ background: "var(--main-color)" }}
            >
              {buttonText}
            </em>
          ) : null}
        </div>
        <div className="right">
          {exportCatData?.catalogImage ? (
            <img src={exportCatData.catalogImage} alt={title || ""} />
          ) : null}
        </div>
      </div>
      <div className="rowDiv">
        <ExportForm />
      </div>
    </div>
  );
};

export default ExportCatalog;
