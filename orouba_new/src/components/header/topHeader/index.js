"use client";
import React, { useEffect, useState } from "react";
import HeaderIcons from "../headerIcons";
import { useRouter } from 'next/navigation';
import BottomHeader from "../bottomHeader";
import { list } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import { resolveMediaUrl } from "@/utils/media";
import { localizedPath } from "@/utils/routes";
const fallbackLogo =
  "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";
const headerOrnament =
  "https://oroubafoods.com/static/media/headerRigh1.4eaddc7ebf9f04965208.png";

const optimizedImageSrc = (src, width = 256) => {
  if (!src || !/^https?:\/\//i.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
};

const TopHeader = ({ data, siteinfo = {} }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [showOrnament, setShowOrnament] = useState(false);
  const { language, data: siteData } = UseGeneral();
  const logoSrc =
    resolveMediaUrl(
      [
        siteinfo?.main_logo,
        siteinfo?.logo,
        siteinfo?.favicon_logo,
        siteData?.logo,
      ].find((src) => typeof src === "string" && src.trim())
        || fallbackLogo
    );
  const optimizedLogoSrc = optimizedImageSrc(logoSrc);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 793px)");
    const updateOrnament = () => setShowOrnament(mediaQuery.matches);

    updateOrnament();
    mediaQuery.addEventListener("change", updateOrnament);
    return () => mediaQuery.removeEventListener("change", updateOrnament);
  }, []);

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
          {optimizedLogoSrc ? <img src={optimizedLogoSrc} alt="Orouba Foods" /> : null}
        </div>
      </div>
      <BottomHeader show={show} setShow={setShow} data={data} />
      <HeaderIcons show={show} setShow={setShow} />
      {showOrnament ? (
        <div className="headerOriginalLines">
          <div className="headerOriginalLinesTrack">
            <img src={headerOrnament} alt="" />
            <img src={headerOrnament} alt="" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TopHeader;
