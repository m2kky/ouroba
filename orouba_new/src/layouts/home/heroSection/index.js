import React from "react";
import { arrowLeft } from "../../../assets/svgIcons";
import Link from "next/link";
import { localizedPath } from "@/utils/routes";
import { HOME_TEXT_FALLBACKS, localizedText, splitHeading } from "@/utils/siteText";
import RichText from "../../../components/RichText";

const optimizedImageSrc = (src) => src;

function Hero({ data, language = "en" }) {
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
  const visionImage = optimizedImageSrc(data?.vision_image);

  return (
    <div className="hero_section home_vision_section d-flex justify-content-between w-full rowDiv">
      {visionImage ? (
        <img
          src={visionImage}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      ) : null}
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {titleParts.first}
          {titleParts.rest ? <span>{titleParts.rest}</span> : null}
        </h1>
        <RichText as="p" html={visionText} className="hero_rich_text" />
        <Link
          className="hone_sections_button d-flex"
          href={localizedPath("/about/whoWeAre", language)}
          prefetch={false}
        >
          <span>{buttonText}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
