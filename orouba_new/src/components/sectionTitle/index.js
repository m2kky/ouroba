"use client";
import React from "react";
import UseGeneral from "../../hooks/useGeneral";
import Link from 'next/link';
import { arrowLeft } from "../../assets/svgIcons";
import { localizedPath } from "@/utils/routes";
import RichText, { hasRichTextMarkup } from "../RichText";
function SectionTitle({
  minColorWord,
  minColorWordAr,
  secondColorWord,
  secondColorWordAr,
  classessName,
  headerClassessName,
  linkNameAr,
  linkName,
  ru,
  link,
  titleHtml,
}) {
  const { language } = UseGeneral();
  const firstPart = language == "ar" ? minColorWordAr : minColorWord;
  const secondPart = language == "ar" ? secondColorWordAr : secondColorWord;
  const containerClassName = [
    "hero_texts",
    "d-flex",
    "flex-column",
    "align-item-start",
    ...(classessName || []),
  ].join(" ");
  const headingClassName = ["d-flex", ...(headerClassessName || [])].join(" ");
  const normalHeading = (
    <>
      {firstPart}
      {secondPart ? <> <span>{secondPart}</span></> : null}
    </>
  );
  const reversedHeading = (
    <>
      {secondPart ? <span>{secondPart}</span> : null}
      {firstPart ? <> {firstPart}</> : null}
    </>
  );

  return (
   <div className={containerClassName}>
   { <>   {hasRichTextMarkup(titleHtml) ? (
        <RichText as="h1" html={titleHtml} className={headingClassName} />
      ) : (
        <h1 className={headingClassName}>
          {language == "en" ? (
            normalHeading
          ) : (
            ru ? normalHeading : reversedHeading
          )}
        </h1>
      )}
      {link && link?.length ? (
        <Link href={localizedPath(link, language)}>
          <span>{language == "ar" ? linkNameAr : linkName}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </Link>
      ) : null}</>}
    </div>
  );
}

export default SectionTitle;

