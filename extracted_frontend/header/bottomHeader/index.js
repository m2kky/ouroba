import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { menus } from "../../../data/navBarData";
import UseGeneral from "../../../hooks/useGeneral";
import "./style.css";
import { FaWindowClose } from "react-icons/fa";
import { WhiteArrowLeft, arrowLeft } from "../../../assets/svgIcons";

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
    setTop(document.querySelector("header")?.clientHeight);
  }, []);
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [show]);
  const [menu, setMenu] = useState([]);

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

    const handleResize = () => {
      updateMenuHeights();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window]);

  useEffect(() => {
    // عكس ترتيب القوائم عندما تكون اللغة "ar" (عربية)
    let submenu = language === "ar" ? [...menus].reverse() : menus;
    if (isSmaller) {
      submenu = menus;
    }
    setMenu(submenu);
  }, [menus, language, isSmaller]);

  const navigate = useNavigate();
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
                setOpenedMenu(openedMenu === index + "_" + menu?.label ? null : index + "_" + menu?.label);
              }}
            >
              <NavLink
                onClick={(e) => {
                  if (
                    menu?.label === "Brands" ||
                    menu?.label_ar === "المنتجات" ||
                    menu?.label === "About Us" ||
                    menu?.label_ar === "عن العروبة"
                  ) {
                    e.preventDefault();
                  }
                }}
                to={menu?.route}
              >
                <span>{language === "ar" ? menu.label_ar : menu.label}</span>
                {menu?.label === "Brands" ||
                menu?.label_ar === "المنتجات" ||
                menu?.label === "About Us" ||
                menu?.label_ar === "عن العروبة"
                  ? WhiteArrowLeft
                  : null}
              </NavLink>
            </label>
            <input
              type="checkbox"
              checked={openedMenu === index + "_" + menu?.label}
              className={"checked"}
              name={index + "_" + menu?.label}
              id={index + "_" + menu?.label}
            />
            {menu?.label === "Brands" || menu?.label_ar === "المنتجات" ? (
              <ul
                style={{ top: top + "px", translate: "-50% -36%" }}
                className={`menu ${
                  Object.keys(openMenus).length && openMenus[index] ? "open" : ""
                }`}
              >
                {data &&
                  Array.isArray(data) &&
                  data?.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      onClick={() => {
                        setShow(false);
                        navigate("/brands/" + item?.id);
                      }}
                    >
                      <NavLink
                        style={language === "ar" ? { justifyContent: "end" } : { justifyContent: "flex-start" }}
                        to={"/brands/" + item?.id}
                      >
                        <span>
                          {" "}
                          {language === "ar" ? item.name_ar : item?.name_en}
                        </span>
                      </NavLink>
                    </li>
                  ))}
              </ul>
            ) : (
              <ul
                style={{ top: top + "px", translate: "-50% -36%" }}
                className={`menu ${
                  Object.keys(openMenus).length && openMenus[index] ? "open" : ""
                }`}
              >
                {menu?.items?.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <NavLink
                      to={item?.route}
                      style={language === "ar" ? { justifyContent: "end" } : { justifyContent: "flex-start" }}
                    >
                      {language === "ar" ? item.label_ar : item?.label}
                    </NavLink>
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
