"use client";
import React from "react";
import UseGeneral from "../../hooks/useGeneral";
import Link from 'next/link';
import { arrowLeft } from "../../assets/svgIcons";
import { localizedPath } from "@/utils/routes";
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
}) {
  const { language } = UseGeneral();
  const firstPart = language == "ar" ? minColorWordAr : minColorWord;
  const secondPart = language == "ar" ? secondColorWordAr : secondColorWord;
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
   <div
      className={
        "hero_texts d-flex flex-column align-item-start " +
        classessName?.join(" ")
      }
    >
   { <>   <h1 className={"d-flex " + headerClassessName?.join(" ")}>
        {language == "en" ? (
          normalHeading
        ) : (
          ru ? normalHeading : reversedHeading
        )}
      </h1>
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

