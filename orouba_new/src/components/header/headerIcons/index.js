"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { language as languageIcon, search } from "../../../assets/svgIcons";
import UseGeneral from "./../../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";

const SearchBox = dynamic(() => import("../searchBox"), { ssr: false });

const HeaderIcons = ({ setShow, show }) => {
  const { changLang2, language } = UseGeneral();
  const router = useRouter();
  const [showSearch, setShowSearh] = useState(false);

  const switchLanguage = (nextLanguage) => {
    changLang2(nextLanguage);
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search + window.location.hash
        : "/";
    const nextPath = /^\/(ar|en)(?=\/|$)/.test(currentPath)
      ? currentPath.replace(/^\/(ar|en)(?=\/|$)/, `/${nextLanguage}`)
      : localizedPath(currentPath, nextLanguage);

    if (nextPath !== currentPath) {
      router.push(nextPath);
    }
  };

  return (
    <div className="headerActions">
      <button
        className="hoverable"
        onClick={() => router.push(localizedPath("/ExportCatalog", language))}
      >
        {language == "ar" ? "تحميل الكتالوج" : "Export Catalogue"}
      </button>
      <div className="menuToggle">
        <div className="menuLabel" style={{ margin: 0 }}>
          {languageIcon}
          <ul
            className="menu"
            style={{ top: "230%", translate: "-50% -36%" }}
          >
            <li className={language == "ar" ? "active" : undefined}>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  switchLanguage("ar");
                }}
              >
                العربية
              </a>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  switchLanguage("en");
                }}
              >
                English
              </a>
            </li>
          </ul>
        </div>
      </div>

      <span role="button" onClick={() => setShowSearh(true)}>
        {search}
      </span>
      {showSearch ? <SearchBox setShowSearchModal={setShowSearh} /> : null}
    </div>
  );
};

export default HeaderIcons;
