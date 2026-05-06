import React, { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import "./style.css";
import { Link, NavLink } from "react-router-dom";
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
import { base_url } from "../../consts";

const Footer = () => {
  const [pageData, setPageData] = useState({});
  const { language, data } = UseGeneral();
  const [openedMenu, setOpenedMenu] = useState(null);
  const [socials, setSocials] = useState([]);
  const [parents, setParents] = useState([]);
  const [menus, setMenus] = useState(["brandatna", "linkatna", "baynatna"]);
  const getContactData = () => {
    // setPageLoading(true)
    axios
      .get(base_url + `pages/contact_page`)
      .then((res) => {
        console.log(res.data.result);
        // console.log(res.data.result.site_info)
        console.log(res.data);
        if (res.data.status == "success") {
          setPageData(res.data.result.site_info);
          if (Array.isArray(res.data.result.socials)) {
            setSocials(res.data.result.socials);
          }

          if (Array.isArray(res.data.result.parents)) {
            setParents(res.data.result.parents);
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
        menus?.map((item) => {
          const ulElement = document.getElementById(`ul_${item}`);
          if (ulElement) {
            ulElement.style.height = "0px";
          }
        });

        const ulElement = document.getElementById(`ul_${openedMenu}`);
        console.log(ulElement, ulElement?.scrollHeight + "px");
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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [openedMenu, menus]);

  return (
    <div class="footer">
      <div class="container">
        <div class="row footer_elements">
          <div class="footer_element">
            <div class="single_footer single_footer_address">
              <img
                src={require("../../assets/footer_logo.png")}
                style={{
                  width: "222px",
                  height: "203px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
          <div class="footer_element">
            <div class="single_footer">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "brandatna"}
                name="brandatna"
                id="brandatna"
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
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </h4>
              <ul id="ul_brandatna">
                <li>
                  <NavLink to="/brands/5">
                    {language == "ar" ? "بسمة" : "Basma"}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/brands/7">
                    {language == "ar" ? "فريدة" : "Farida"}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/brands/8">
                    {language == "ar" ? "باببيتس" : "Bap Bites"}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="footer_element">
            <div class="single_footer single_footer_address">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "linkatna"}
                name="linkatna"
                id="linkatna"
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
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </h4>

              <ul id="ul_linkatna">
                <li>
                  <NavLink to="/about/whoWeAre">
                    {language == "ar" ? "من نحن" : "About Us"}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about/ProductType">
                    {language == "ar" ? "منتجاتنا" : "Our Products"}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Reciepe">
                    {language == "ar" ? "وصفات" : "Recipes"}{" "}
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="#">
                    {language == "ar" ? "الأسئلة الشائعة" : "FAQ"}
                  </NavLink>
                </li> */}
              </ul>
            </div>
          </div>
          <div class="footer_element single_footer_width">
            <div class="single_footer single_footer_address">
              <input
                className="checked"
                type="checkbox"
                checked={openedMenu == "baynatna"}
                name="baynatna"
                id="baynatna"
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
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
      <div class="w-full">
        <div class="col-lg-12 col-sm-12 col-xs-12">
          <p class="copyright">
            {language != "ar" ? "Copyright to" : "جميع الحقوق محفوظة لدى"} ©
            2024 <a href="#">{language == "ar" ? "العروبة" : "Orouba"}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
