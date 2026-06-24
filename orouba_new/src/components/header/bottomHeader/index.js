"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { menus } from "../../../data/navBarData";
import UseGeneral from "../../../hooks/useGeneral";
import { FaWindowClose } from "react-icons/fa";
import { WhiteArrowLeft } from "../../../assets/svgIcons";
import { localizedPath } from "@/utils/routes";

const BottomHeader = ({ show, setShow, data }) => {
  const { language } = UseGeneral();
  const [openMenus, setOpenMenus] = useState({});
  const [openedMenu, setOpenedMenu] = useState(null);
  const toggleMenu = (index) => {
    setOpenMenus((prevState) => ({
      ...Object.fromEntries(Object.keys(prevState).map((key) => [key, false])),
      [index]: !prevState[index],
    }));
  };

  const [top, setTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return undefined;

    const updateTop = () => setTop(header.clientHeight);
    const frameId = window.requestAnimationFrame(updateTop);
    const resizeObserver = new ResizeObserver(updateTop);
    resizeObserver.observe(header);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);
  const [isSmaller, setIsSmaller] = useState(false);
  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 792px)");

      if (mediaQuery.matches) {
        setIsSmaller(true);
      } else {
        setIsSmaller(false);
      }
    };

    updateMenuHeights();

    // Optionally, you can add a resize event listener to handle window resizing
    const handleResize = () => {
      updateMenuHeights();
    };

    (typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener("resize", handleResize);

    return () => {
      (typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener("resize", handleResize);
    };
  }, []);
  const menu = useMemo(
    () => (language == "ar" && !isSmaller ? menus.slice().reverse() : menus),
    [language, isSmaller]
  );

  const router = useRouter();
  return (
    <div className={show ? "menu_Toggle active" : "menu_Toggle"}>
      <div className="menuToggle">
        <span
          className="closeBtn"
          onClick={() => {
            setShow(false);
          }}
        >
          <FaWindowClose />
        </span>
        {menu?.map((menu, index) => (
          <div
            className="menuLabel menuLabelleb"
            key={index}
            onClick={() => {
              if (!menu?.items?.length) {
                toggleMenu(index);
                setShow(false);
              }
            }}
          >
            <label
              htmlFor={index + "_" + menu?.label}
              onClick={() => {
                setOpenedMenu(openedMenu == index + "_" + menu?.label ? null : index + "_" + menu?.label);
              }}
            >
              <Link
                onClick={(e) => {
                  if (
                    menu?.label == "Brands" ||
                    menu?.label_ar == "المنتجات" ||
                    menu?.label == "About Us" ||
                    menu?.label_ar == "عن العروبة"
                  ) {
                    e.preventDefault();
                  }
                }}
                href={localizedPath(menu?.route || "#", language)}
              >
                <span>{language == "ar" ? menu.label_ar : menu.label}</span>
                {menu?.label == "Brands" ||
                menu?.label_ar == "المنتجات" ||
                menu?.label == "About Us" ||
                menu?.label_ar == "عن العروبة"
                  ? WhiteArrowLeft
                  : null}
              </Link>
            </label>
            <input
              type="checkbox"
              checked={openedMenu == index + "_" + menu?.label}
              className={"checked"}
              name={index + "_" + menu?.label}
              id={index + "_" + menu?.label}
              readOnly
            />
            {menu?.label == "Brands" || menu?.label_ar == "المنتجات" ? (
              <ul
                style={{ top: top + "px", translate: "-50% -36%" }}
                className={`menu ${
                  Object.keys(openMenus).length && openMenus[index]
                    ? "open"
                    : ""
                }`}
                // href="/"
              >
                {data&&Array.isArray(data)&&data?.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    onClick={() => {
                      setShow(false);
                      router.push(localizedPath("/brands/" + item?.id, language));
                    }}
                  >
                    <Link
                      style={language == "ar" ? { justifyContent: "end" } : { justifyContent: "flex-start" }}
                      href={localizedPath("/brands/" + item?.id, language)}
                    >
                      <span>
                        {" "}
                        {language == "ar"
                          ? item.nameAr || item.name_ar
                          : item?.nameEn || item?.name_en}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul
                style={{ top: top + "px", translate: "-50% -36%" }}
                className={`menu ${
                  Object.keys(openMenus).length && openMenus[index]
                    ? "open"
                    : ""
                }`}
                href="/"
              >
                {menu?.items?.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <Link href={localizedPath(item?.route, language)} style={language == "ar" ? {justifyContent:"end"} : {justifyContent:"flex-start"}}>
                      {language == "ar" ? item.label_ar : item?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomHeader;

