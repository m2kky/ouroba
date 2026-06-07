"use client";
import React from "react";
import { arrowLeft } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import { useRouter } from "next/navigation";
import { localizedPath } from "@/utils/routes";
import { HOME_TEXT_FALLBACKS, localizedText, splitHeading } from "@/utils/siteText";

function Hero({ data }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const visionTitle = localizedText(
    data,
    language,
    ["home_vision_title", "vision_title"],
    HOME_TEXT_FALLBACKS.visionTitle
  );
  const visionText = localizedText(data, language, ["home_vision_text", "vision"]);
  const buttonText = localizedText(
    data,
    language,
    ["home_vision_button_text", "about_button_text"],
    HOME_TEXT_FALLBACKS.aboutUs
  );
  const titleParts = splitHeading(visionTitle);

  return (
    <div className="hero_section d-flex justify-content-between w-full rowDiv">
      {data?.vision_image ? <img src={data.vision_image} alt="" /> : null}
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {titleParts.first}
          {titleParts.rest ? <span>{titleParts.rest}</span> : null}
        </h1>
        {visionText ? <p>{visionText}</p> : null}
        <button
          className="hone_sections_button d-flex"
          onClick={() => router.push(localizedPath("/about/whoWeAre", language))}
        >
          <span>{buttonText}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Hero;
