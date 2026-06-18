"use client";
import React from "react";
import { arrowLeft } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import { useRouter } from "next/navigation";
import { localizedPath } from "@/utils/routes";
import { HOME_TEXT_FALLBACKS, localizedText, splitHeading } from "@/utils/siteText";
import RichText from "../../../components/RichText";

function MapSection({ data }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const title = localizedText(
    data,
    language,
    ["home_world_title", "world_title"],
    HOME_TEXT_FALLBACKS.worldTitle
  );
  const text = localizedText(data, language, ["home_world_text", "world_text", "export_world"]);
  const buttonText = localizedText(
    data,
    language,
    ["home_world_button_text", "learn_more_text"],
    HOME_TEXT_FALLBACKS.learnMore
  );
  const titleParts = splitHeading(title);

  return (
    <div className="hero_section map_section d-flex justify-content-between w-full rowDiv">
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {titleParts.first}
          {titleParts.rest ? <span> {titleParts.rest}</span> : null}
        </h1>
        <RichText as="p" html={text} className="hero_rich_text" />
        <button
          className="hone_sections_button d-flex"
          onClick={() => router.push(localizedPath("/export", language))}
        >
          <span>{buttonText}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </button>
      </div>
      {data?.map ? (
        <img
          src={data.map}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : null}
    </div>
  );
}

export default MapSection;
