"use client";
import React, { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import Link from 'next/link';
import { MdOutlineMailOutline } from "react-icons/md";
import {
  Email,
  Facebook,
  HouseIcon,
  Instagram,
  Printer,
  SupportIcon,
} from "../../assets/svgIcons";
import axios from "axios";
import {  base_url  } from '@/consts';
import { resolveMediaTree } from "@/utils/media";
import { localizedPath } from "@/utils/routes";

const Footer = () => {
  const [pageData, setPageData] = useState({});
  const { language, data } = UseGeneral();
  const footerLogoSrc = [pageData?.logo, data?.logo].find(
    (src) => typeof src === "string" && src.trim()
  );
  const [openedMenu, setOpenedMenu] = useState(null);
  const [socials, setSocials] = useState([]);
  const [parents, setParents] = useState([]);
  const [menus, setMenus] = useState(["brandatna", "linkatna", "baynatna"]);
  const getContactData = () => {
    // setPageLoading(true)
    axios
      .get(base_url + `pages/contact_page`)
      .then((res) => {
        const result = resolveMediaTree(res.data.result);
        if (res.data.status == "success") {
          setPageData(result.site_info);
          if (Array.isArray(result.socials)) {
            setSocials(result.socials);
          }

          if (Array.isArray(result.parents)) {
            setParents(result.parents);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        // setPageLoading(false)
      });
  };
  useEffect(() => {
    getContactData();
  }, []);
  const arabicDigits = {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩",
  };
  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 792px)");

      if (mediaQuery.matches) {
        // If the media query is matched (width <= 792px)
        menus?.forEach((item) => {
          const ulElement = document.getElementById(`ul_${item}`);
          if (ulElement) {
            ulElement.style.height = "0px";
          }
        });

        const ulElement = document.getElementById(`ul_${openedMenu}`);
        if (ulElement) {
          ulElement.style.height = ulElement.scrollHeight + "px";
        }
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
  }, [openedMenu, menus]);

  return (
    <div className="footer">
      <div className="container">
        <div className="row footer_elements">
          <div className="footer_element">
            <div className="single_footer single_footer_address">
              {footerLogoSrc ? (
                <img
                  src={footerLogoSrc}
                  alt="Orouba Foods"
                  style={{
                    width: "222px",
                    height: "203px",
                    objectFit: "contain",
                  }}
                />
              ) : null}
            </div>
          </div>
          <div className="footer_element">
            <div className="single_footer">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "brandatna"}
                name="brandatna"
                id="brandatna"
                readOnly
              />
              <h4
                onClick={() =>
                  setOpenedMenu(openedMenu == "brandatna" ? null : "brandatna")
                }
              >
                {language == "ar" ? "منتجاتنا" : "Our Brands"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="18"
                  viewBox="0 0 21 18"
                  fill="none"
                >
                  <path
                    d="M8.32715 5.4831L12.672 9.00034L8.32715 12.5176"
                    stroke="#FFF100"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h4>
              <ul id="ul_brandatna">
                <li>
                  <Link href={localizedPath("/brands/5", language)}>
                    {language == "ar" ? "بسمة" : "Basma"}
                  </Link>
                </li>
                <li>
                  <Link href={localizedPath("/brands/7", language)}>
                    {language == "ar" ? "فريدة" : "Farida"}
                  </Link>
                </li>
                <li>
                  <Link href={localizedPath("/brands/8", language)}>
                    {language == "ar" ? "باببيتس" : "Bap Bites"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer_element">
            <div className="single_footer single_footer_address">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "linkatna"}
                name="linkatna"
                id="linkatna"
                readOnly
              />
              <h4
                onClick={() =>
                  setOpenedMenu(openedMenu == "linkatna" ? null : "linkatna")
                }
              >
                {language != "ar" ? "Quick Links" : "روابط سريعة"}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="18"
                  viewBox="0 0 21 18"
                  fill="none"
                >
                  <path
                    d="M8.32715 5.4831L12.672 9.00034L8.32715 12.5176"
                    stroke="#FFF100"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h4>

              <ul id="ul_linkatna">
                <li>
                  <Link href={localizedPath("/about/whoWeAre", language)}>
                    {language == "ar" ? "من نحن" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link href={localizedPath("/about/ProductType", language)}>
                    {language == "ar" ? "منتجاتنا" : "Our Products"}
                  </Link>
                </li>
                <li>
                  <Link href={localizedPath("/Reciepe", language)}>
                    {language == "ar" ? "وصفات" : "Recipes"}{" "}
                  </Link>
                </li>
                {/* <li>
                  <Link href="#">
                    {language == "ar" ? "الأسئلة الشائعة" : "FAQ"}
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="footer_element single_footer_width">
            <div className="single_footer single_footer_address">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "baynatna"}
                name="baynatna"
                id="baynatna"
                readOnly
              />
              <h4
                onClick={() =>
                  setOpenedMenu(openedMenu == "baynatna" ? null : "baynatna")
                }
              >
                {language == "ar" ? "اتصل بنا" : "Contact Us"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="18"
                  viewBox="0 0 21 18"
                  fill="none"
                >
                  <path
                    d="M8.32715 5.4831L12.672 9.00034L8.32715 12.5176"
                    stroke="#FFF100"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h4>

              <div className="contact_info" id="ul_baynatna">
                <div className="contact_info_row">
                  <div className="icon">{HouseIcon}</div>
                  <div className="info">
                    {language == "ar"
                      ? pageData?.location_ar
                      : pageData?.location_en}
                  </div>
                </div>
                <div className="contact_info_row">
                  <div className="icon">{SupportIcon}</div>
                  <div className="info">
                    {language == "ar"
                      ? pageData?.service_phone
                          ?.replace(/\d/g, (digit) => arabicDigits[digit])
                          ?.split(" ")
                          ?.reverse()
                          ?.join(" ")
                      : pageData?.service_phone}
                  </div>
                </div>
                <div className="contact_info_row">
                  <div className="icon">{Printer}</div>
                  <div className="info">
                    {language == "ar"
                      ? pageData?.phone
                          ?.replace(/\d/g, (digit) => arabicDigits[digit])
                          ?.split(" ")
                          ?.reverse()
                          ?.join(" ")
                      : pageData?.phone}
                  </div>
                </div>
                <div className="contact_info_row">
                  {/* <div className="icon"></div> */}
                  <MdOutlineMailOutline
                    style={{ color: "#fff100", fontSize: "30px" }}
                  />
                  <div className="info">{pageData?.email}</div>
                </div>
                {parents &&
                  parents.map((itParent, indParent) => {
                    return (
                      <div className="parent_social" key={indParent}>
                        <img src={itParent?.image} alt="" />
                        <div className="me_social_icons">
                          {itParent.socials &&
                            itParent.socials.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className="icon"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    window.open(item.link, "_target")
                                  }
                                >
                                  <img
                                    src={item.image}
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      cursor: "pointer",
                                    }}
                                    alt=""
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="col-lg-12 col-sm-12 col-xs-12">
          <p className="copyright">
            {language != "ar" ? "Copyright to" : "جميع الحقوق محفوظة لدى"} ©
            2024 <a href="#">{language == "ar" ? "العروبة" : "Orouba"}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;

