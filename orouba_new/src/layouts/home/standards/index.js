"use client";
import React from "react";
import { arrowLeft } from "../../../assets/svgIcons";
import SectionTitle from "../../../components/sectionTitle";
import Standard from "../../../components/standards";
import Link from "next/link";
import UseGeneral from "../../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";
import { HOME_TEXT_FALLBACKS, localizedText, splitHeading } from "@/utils/siteText";
import RichText from "../../../components/RichText";

function Standards({ data, siteinfo }) {
  const { language } = UseGeneral();
  const title = localizedText(
    siteinfo,
    language,
    ["home_standards_title", "exportStandardsTitle"],
    HOME_TEXT_FALLBACKS.standardsTitle
  );
  const text = localizedText(
    siteinfo,
    language,
    ["home_standards_text", "exportStandardsText", "stander"],
    HOME_TEXT_FALLBACKS.standardsText
  );
  const linkText = localizedText(
    siteinfo,
    language,
    ["home_standards_button_text", "learn_more_text"],
    HOME_TEXT_FALLBACKS.learnMore
  );
  const titleParts = splitHeading(title);
  const standards = Array.isArray(data) ? data : [];

  return (
    <div className="hero_section standard_section d-flex justify-content-between flex-column w-full homeStandard rowDiv">
      <SectionTitle
        minColorWord={titleParts.first}
        minColorWordAr={titleParts.first}
        secondColorWordAr={titleParts.rest}
        secondColorWord={titleParts.rest}
        classessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
        headerClassessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
      />
      {text ? (
        <RichText
          html={text}
          className="text-center"
          style={{
            color: "var(--sec-color)",
            width: "80%",
            margin: "auto",
            fontSize: "23px",
            fontWeight: "400",
            textAlign: "center  !important",
          }}
        />
      ) : null}
      <div className="standardsImages d-flex justify-content-between">
        {standards.length ? (
          standards.map((item, index) => {
            return (
              <Standard
                key={item?.id ?? index}
                title={item?.title}
                description={
                  language == "ar" ? item?.description_ar : item?.description_en
                }
                icon={item?.image}
              />
            );
          })
        ) : null}
      </div>
      <Link href={localizedPath("/export", language)}>
        <span>{linkText}</span>
        <span
          style={{
            rotate: language == "ar" ? "180deg" : "0",
            display: "inline-block",
          }}
        >
          {arrowLeft}
        </span>
      </Link>
    </div>
  );
}

export default Standards;
