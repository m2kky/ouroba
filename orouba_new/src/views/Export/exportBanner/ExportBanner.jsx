"use client";
import React from "react";
import UseGeneral from "../../../hooks/useGeneral";
import RichText from "../../../components/RichText";

const localizedSetting = (settings, key, language) => {
  const value =
    language === "ar"
      ? settings?.[`${key}Ar`] || settings?.[key]
      : settings?.[`${key}En`] || settings?.[key];

  return typeof value === "string" ? value : "";
};

const ExportBanner = ({ exportData }) => {
  const { language } = UseGeneral();
  const title = localizedSetting(exportData, "exportTitle", language);
  const description = localizedSetting(exportData, "exportDescription", language);
  const image = exportData?.exportImage;

  return (
    <div className="export_banner rowDiv">
      <div className="left">
        {image ? <img src={image} className="largeScreen" alt={title || ""} /> : null}
      </div>
      <div className="right">
        {title ? <h5>{title}</h5> : null}
        {description ? (
          <div className="texts">
            <RichText html={description} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ExportBanner;
