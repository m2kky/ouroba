import React, { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import Breadcrumb from "./../../components/BreadCumbsLinks/index";
import contactusImage from "./../../assets/contactUsImage.png";
import {
  HouseIcon,
  Printer,
  SupportIcon,
  Facebook,
  Instagram,
  Email,
} from "../../assets/svgIcons";
import "./style.css";
import axios from "axios";
// import { BASE_URL } from "../../Axios/base_url";
import { ThreeDots } from "react-loader-spinner";
import { base_url } from "./../../consts";

const ContactUs = () => {
  const { language } = UseGeneral();
  const [contactLoading, setContactLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mesSuc, setMesSuc] = useState("");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    type_inqury: "",
    message: "",
  });
  const [socials, setSocials] = useState([]);
  const [data, setData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  const breadCrumb = [
    {
      name: language == "ar" ? "الرئيسية " : "Home",
      path: "/",
    },
    {
      name: language == "ar" ? "تواصل معنا " : "ContactUs",
      path: "/contactus",
      active: true,
    },
  ];

  const getContactData = () => {
    setPageLoading(true);
    axios
      .get(base_url + `pages/contact_page`)
      .then((res) => {
        // console.log(res.data.result.site_info)
        console.log(res.data);
        if (res.data.status == "success") {
          setData(res.data.result.site_info);
          if (Array.isArray(res.data.result.socials)) {
            setSocials(res.data.result.parents);
          }
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  };

  const handleContact = () => {
    setContactLoading(true);
    const data_send = {
      ...contactData,
    };
    console.log(data_send);
    axios
      .post(base_url + `contacts/add_new`, data_send)
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          setMessage("Success To Send Message");
          setContactData({
            name: "",
            email: "",
            phone: "",
            type_inqury: "",
            message: "",
          });
          setMesSuc(true);
        } else if (res.data.status == "faild") {
          setMessage(res.data.message);
          setMesSuc(false);
        } else {
          setMessage("Something Went Error");
          setMesSuc(false);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setContactLoading(false);
      });
  };

  useEffect(() => {
    if (mesSuc == true || mesSuc == false) {
      setTimeout(() => {
        setMesSuc("");
        setMessage("");
      }, 2000);
    }
  }, [mesSuc]);

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
  return (
    <div className="me_cotactUs_page rowDiv">
      <Breadcrumb links={breadCrumb} />

      <div className="me_contactUs_cotainer">
        <div className="left_section">
          <div className="image">
            {/* <img src={contactusImage} alt="" /> */}
            <div className="left_content">
              <div className="map_info">
                <div
                  className=""
                  style={{ zIndex: 123 }}
                  onClick={() => window.open(data?.map_url, "_blanck")}
                >
                  <iframe
                    className="contact_map"
                    src={
                      data?.map_url ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.307053322222!2d31.45404992567111!3d30.199782611196362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581a9954fd0425%3A0x3303686a7c8ac8b6!2z2KfZhNi52LHZiNio2Kkg2YTYtdmG2KfYudipINin2YTZhdmI2KfYryDYp9mE2LrYsNin2KbZitipINio2LPZhdip!5e0!3m2!1sar!2seg!4v1714378113955!5m2!1sar!2seg"
                    }
                    style={{ border: 0, zIndex: -1, position: "relative" }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="contact_info">
                  <div className="contact_info_row">
                    <div className="icon">{HouseIcon}</div>
                    <div className="info">
                      {language == "ar" ? data?.location_ar : data?.location_en}
                    </div>
                  </div>
                  <div className="contact_info_row">
                    <div className="icon">{SupportIcon}</div>
                    <div className="info">
                      {language == "ar"
                        ? data?.service_phone
                            ?.replace(/\d/g, (digit) => arabicDigits[digit])
                            ?.split(" ")
                            ?.reverse()
                            ?.join(" ")
                        : data?.service_phone}
                    </div>
                  </div>
                  <div className="contact_info_row">
                    <div className="icon">{Printer}</div>
                    <div className="info">
                      {language == "ar"
                        ? data?.phone
                            ?.replace(/\d/g, (digit) => arabicDigits[digit])
                            ?.split(" ")
                            ?.reverse()
                            ?.join(" ")
                        : data?.phone}
                    </div>
                  </div>
                  <div className="contact_info_row">
                    <div style={{ color: "#035297" }} className="icon">
                      {Email}
                    </div>
                    <div className="info">{data?.email}</div>
                  </div>
                </div>
              </div>
              <div className="me_social_icons">
                {/* <div
                    className="icon"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open("https://www.facebook.com", "_target")
                    }
                  >
                    {Facebook}
                  </div>
                  <div
                    className="icon"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open("https://www.instagram.com", "_target")
                    }
                  >
                    {Instagram}
                  </div> */}
                {socials &&
                  socials.map((itParent, indParent) => {
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

        <div className="Right_section">
          <div className="title">
            {language == "ar" ? "اتصل بنا" : "Contact Us"}
          </div>

          <div className="fill_up">
            {language == "ar"
              ? "املأ النموذج وسيقوم فريقنا بالرد عليك."
              : "Fill up the form and our team will get back to you."}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleContact();
            }}
            action=""
            className="me_contact_form"
          >
            <div className="me_form_input">
              <div className="me_input_lable">
                {language == "ar" ? "الاسم" : "Your Name"}{" "}
                <span className="req_star">*</span>
              </div>
              <input
                value={contactData.name}
                onChange={(e) => {
                  setContactData({ ...contactData, name: e.target.value });
                }}
                type="text"
                placeholder={
                  language == "ar" ? "برجاء إدخال اسمك" : "Ex. Rick Jourden "
                }
              />
            </div>
            <div className="mail_number">
              <div className="me_form_input">
                <div className="me_input_lable">
                  {language == "ar" ? "بريدك الالكتروني" : "Your Mail"}
                  <span className="req_star">*</span>
                </div>
                <input
                  value={contactData.email}
                  onChange={(e) => {
                    setContactData({ ...contactData, email: e.target.value });
                  }}
                  type="text"
                  placeholder={
                    language == "ar"
                      ? "برجاء إدخال بريد الالكتروني"
                      : "Ex. mmohh33650@gmail.com "
                  }
                />
              </div>
              <div className="me_form_input">
                <div className="me_input_lable">
                  {language == "ar" ? "رقمك" : "Your Number"}{" "}
                  <span className="req_star">*</span>
                </div>
                <input
                  value={contactData.phone}
                  onChange={(e) => {
                    setContactData({ ...contactData, phone: e.target.value });
                  }}
                  type="text"
                  placeholder={
                    language == "ar"
                      ? "برجاء إدخال رقم هاتفك"
                      : "Enter your number"
                  }
                />
              </div>
            </div>
            <div className="me_form_input">
              <div className="me_input_lable">
                {language == "ar" ? "نوع الاستفسار" : "Type Of Inquiry"}{" "}
                <span className="req_star">*</span>
              </div>
              <select
                onChange={(e) => {
                  setContactData({
                    ...contactData,
                    type_inqury: e.target.value,
                  });
                }}
                name=""
                id=""
              >
                <option value="pls">
                  {language == "ar"
                    ? "برجاء تحديد اختيار"
                    : "-Please choose an option-"}
                </option>
                <option value="pls">
                  {language != "ar"
                    ? "Inquire About Receipes"
                    : "الاستعلام عن الوجبات"}
                </option>
              </select>
            </div>

            <div className="me_form_input">
              <div className="me_input_lable">
                {language == "ar" ? "رسالتك" : "Your Message"}
                <span className="req_star">*</span>
              </div>
              <textarea
                onChange={(e) => {
                  setContactData({ ...contactData, message: e.target.value });
                }}
                placeholder={
                  language == "ar" ? " رسالتك " : "Type your message here"
                }
                name=""
                id=""
                cols="30"
                rows="6"
              ></textarea>
            </div>
            {message && message?.length ? (
              <>
                {mesSuc == true ? (
                  <p
                    style={{ textAlign: "center", color: "green" }}
                    className="success_mes"
                  >
                    {message}
                  </p>
                ) : mesSuc == false ? (
                  <p
                    style={{ textAlign: "center", color: "red" }}
                    className="error_mes"
                  >
                    {message}
                  </p>
                ) : null}
              </>
            ) : null}
            <div className="me_send_button">
              {contactLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div className="rowDiv">
                    {" "}
                    <ThreeDots color="#035297" />
                  </div>
                </div>
              ) : (
                <button>{language == "ar" ? "إرسال" : "Send"}</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
