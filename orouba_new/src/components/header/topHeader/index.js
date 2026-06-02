"use client";
import React, { useState } from "react";
import SearchBox from "../searchBox";
import HeaderIcons from "../headerIcons";
import { useRouter } from 'next/navigation';
import BottomHeader from "../bottomHeader";
import { list } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import { resolveMediaUrl } from "@/utils/media";
import { localizedPath } from "@/utils/routes";
const fallbackLogo =
  "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";
const headerLeft =
  "https://oroubafoods.com/static/media/headerRigh1.4eaddc7ebf9f04965208.png";
const headerRight =
  "https://oroubafoods.com/static/media/headerRigh1.4eaddc7ebf9f04965208.png";

const TopHeader = ({ data }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { language, data: siteData } = UseGeneral();
  const logoSrc =
    resolveMediaUrl(
      typeof siteData?.logo === "string" && siteData.logo.trim()
        ? siteData.logo
        : fallbackLogo
    );

  return (
    <div className="rowDiv">
      <div className="row d-flex">
        <span className="list_toggle" onClick={() => setShow(!show)}>
          {" "}
          {list}
        </span>
        <div
          style={{ cursor: 'pointer' }}
          className="logo"
          onClick={() => router.push(localizedPath("/", language))}
        >
          {logoSrc ? <img src={logoSrc} alt="Orouba Foods" /> : null}
        </div>
      </div>
      <BottomHeader show={show} setShow={setShow} data={data} />
      <HeaderIcons show={show} setShow={setShow} />
      <div className="imageHeader">
        <div className={`headerImage ${language == "ar" ? "active" : ""}`}>
          <img src={language == "ar"?headerLeft : headerRight}/>
          <img src={language == "ar"?headerLeft : headerRight}/>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
