"use client";
import React from "react";
import UseGeneral from "../../../hooks/useGeneral";
import Standard from "../../../components/standards";
import RichText from "../../../components/RichText";

const localizedSetting = (settings, key, language) => {
  const value =
    language === "ar"
      ? settings?.[`${key}Ar`] || settings?.[key]
      : settings?.[`${key}En`] || settings?.[key];

  return typeof value === "string" ? value : "";
};

const ExportStandars = ({ exportData, standersData = [] }) => {
  const { language } = UseGeneral();
  const title =
    localizedSetting(exportData, "exportStandardsTitle", language) ||
    localizedSetting(exportData, "home_standards_title", language);
  const text =
    localizedSetting(exportData, "exportStandardsText", language) ||
    localizedSetting(exportData, "home_standards_text", language);
  const standars = Array.isArray(standersData)
    ? standersData.filter((item) => !item?.isHidden)
    : [];

  return (
    <div className="export_standars">
      {title ? (
        <h4>
          <span>{title}</span>
        </h4>
      ) : null}
      <RichText html={text} style={{ textAlign: "center" }} />
      <div className="standardsImages d-flex my-3 justify-content-between">
        {standars.map((item) => (
          <Standard
            key={item.id}
            description={
              language == "ar"
                ? item?.descriptionAr || item?.description_ar
                : item?.descriptionEn || item?.description_en
            }
            icon={item?.image}
          />
        ))}
      </div>
    </div>
  );
};

export default ExportStandars;
