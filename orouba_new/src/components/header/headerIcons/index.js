"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { language as languageIcon, search } from "../../../assets/svgIcons";
import UseGeneral from "./../../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";

const SearchBox = dynamic(() => import("../searchBox"), { ssr: false });

const HeaderIcons = ({ setShow, show }) => {
  const { language } = UseGeneral();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSearch, setShowSearh] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isDesktopLanguageToggle, setIsDesktopLanguageToggle] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 793px)");
    const updateLanguageToggleMode = () => {
      setIsDesktopLanguageToggle(mediaQuery.matches);
      if (mediaQuery.matches) {
        setShowLanguageMenu(false);
      }
    };

    updateLanguageToggleMode();
    mediaQuery.addEventListener("change", updateLanguageToggleMode);
    return () => mediaQuery.removeEventListener("change", updateLanguageToggleMode);
  }, []);

  const toggleLanguageMenu = () => {
    if (isDesktopLanguageToggle) {
      setShowLanguageMenu(false);
      return;
    }

    setShowLanguageMenu((open) => !open);
  };

  const languagePath = (nextLanguage) => {
    const currentPath = pathname || "/";
    const localizedRoute = /^\/(ar|en)(?=\/|$)/.test(currentPath)
      ? currentPath.replace(/^\/(ar|en)(?=\/|$)/, `/${nextLanguage}`)
      : localizedPath(currentPath, nextLanguage);
    const query = searchParams.toString();
    return query ? `${localizedRoute}?${query}` : localizedRoute;
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
        <div
          className={`menuLabel languageToggle ${showLanguageMenu ? "active" : ""}`}
          style={{ margin: 0 }}
          role={isDesktopLanguageToggle ? undefined : "button"}
          tabIndex={isDesktopLanguageToggle ? undefined : 0}
          aria-haspopup={isDesktopLanguageToggle ? undefined : "menu"}
          aria-expanded={isDesktopLanguageToggle ? undefined : showLanguageMenu}
          onClick={toggleLanguageMenu}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleLanguageMenu();
            }
          }}
        >
          {languageIcon}
          <ul
            className={showLanguageMenu ? "languageMenu languageMenuOpen" : "menu languageMenu"}
            style={{
              top: "230%",
              translate: "-50% -36%",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <li className={language == "ar" ? "active" : undefined}>
              <Link
                href={languagePath("ar")}
                prefetch
                scroll={false}
                onClick={() => setShowLanguageMenu(false)}
              >
                العربية
              </Link>
              <Link
                href={languagePath("en")}
                prefetch
                scroll={false}
                onClick={() => setShowLanguageMenu(false)}
              >
                English
              </Link>
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
