import React from "react";
import "./style.css";
import UseGeneral from "../../hooks/useGeneral";
import { Link } from "react-router-dom";
import { arrowLeft } from "../../assets/svgIcons";
function SectionTitle({
  minColorWord,
  minColorWordAr,
  secondColorWord,
  secondColorWordAr,
  classessName,
  headerClassessName,
  rem,
  linkNameAr,
  linkName,
  ru,
  link,
}) {
  const { language } = UseGeneral();
  return (
   <div
      className={
        "hero_texts d-flex flex-column align-item-start " +
        classessName?.join(" ")
      }
    >
   { <>   <h1 className={"d-flex " + headerClassessName?.join(" ")}>
        {language == "en" ? (
          <>
            {" "}
            {language == "ar" ? minColorWordAr : minColorWord}
            <span>
              {language == "ar" ? secondColorWordAr : secondColorWord}
            </span>
          </>
        ) : (
         ru ? <>
         {" "}
         {language == "ar" ? minColorWordAr : minColorWord}
         <span>
           {language == "ar" ? secondColorWordAr : secondColorWord}
         </span>
         </> : <>
            {" "}
            <span>
              {language == "ar" ? secondColorWordAr : secondColorWord}
            </span>
            {language == "ar" ? minColorWordAr : minColorWord}
            </>
        )}
      </h1>
      {link && link?.length ? (
        <Link to={link}>
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
