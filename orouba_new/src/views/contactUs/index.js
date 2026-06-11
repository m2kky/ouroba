"use client";
import React, { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import Breadcrumb from "./../../components/BreadCumbsLinks/index";
import RichText from "../../components/RichText";
import {
  HouseIcon,
  Printer,
  SupportIcon,
  Email,
} from "../../assets/svgIcons";
import { ThreeDots } from "react-loader-spinner";
import { submitContactForm } from "@/actions/contact";

const CONTACT_FALLBACKS = {
  addressAr:
    "مدينة العبور، بلوك ١٢٠٠٨، قسم ٥، القاهرة، ص.ب: العبور ٤٢، مدينة العبور، مصر",
  addressEn:
    "El Obour City, Block 12008, Section 5, Cairo, P.O. Box: El Obour 42, El Obour City, Egypt",
  phone: "202 44890220",
  fax: "202 44890227",
  email: "info@oroubafoods.com",
};

const INQUIRY_OPTIONS = [
  { value: "general", ar: "استفسار عام", en: "General Inquiry" },
  { value: "sales", ar: "المبيعات", en: "Sales" },
  { value: "export", ar: "التصدير", en: "Export" },
  { value: "careers", ar: "الوظائف", en: "Careers" },
  { value: "suppliers", ar: "الموردين", en: "Suppliers" },
];

const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const ContactUs = ({ data, socials }) => {
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

  const breadCrumb = [
    {
      name: language == "ar" ? "الرئيسية " : "Home",
      route: "/",
    },
    {
      name: language == "ar" ? "تواصل معنا " : "ContactUs",
      active: true,
    },
  ];

  const handleContact = async () => {
    setContactLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", contactData.name);
      formData.append("email", contactData.email);
      formData.append("phone", contactData.phone);
      formData.append("type_inqury", contactData.type_inqury);
      formData.append("message", contactData.message);

      const res = await submitContactForm(formData);
      if (res.status == "success") {
        setMessage(language == "ar" ? "تم ارسال الرسالة بنجاح" : "Message sent successfully");
        setContactData({
          name: "",
          email: "",
          phone: "",
          type_inqury: "",
          message: "",
        });
        setMesSuc(true);
      } else {
        setMessage(res.message || "Error");
        setMesSuc(false);
      }
    } catch {
      setMessage("Error");
      setMesSuc(false);
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    if (mesSuc === true || mesSuc === false) {
      setTimeout(() => {
        setMesSuc("");
        setMessage("");
      }, 3000);
    }
  }, [mesSuc]);

  const arabicDigits = {
    0: "٠", 1: "١", 2: "٢", 3: "٣", 4: "٤", 5: "٥", 6: "٦", 7: "٧", 8: "٨", 9: "٩",
  };

  const formatContactNumber = (value) => {
    const text = String(value || "").trim();
    if (language !== "ar" || !text) {
      return text;
    }

    const localized = text.replace(/\d/g, (digit) => arabicDigits[digit]);
    return /\d/.test(text) ? localized.split(/\s+/).reverse().join(" ") : localized;
  };

  const contactAddress =
    language == "ar"
      ? firstText(
          data?.locationAr,
          data?.addressAr,
          data?.location_ar,
          data?.address_ar,
          CONTACT_FALLBACKS.addressAr,
          data?.location,
          data?.address
        )
      : firstText(
          data?.locationEn,
          data?.addressEn,
          data?.location_en,
          data?.address_en,
          data?.location,
          data?.address,
          CONTACT_FALLBACKS.addressEn
        );
  const contactPhone = firstText(
    data?.servicePhone,
    data?.phone_1,
    data?.phone,
    CONTACT_FALLBACKS.phone
  );
  const contactFax = firstText(
    data?.fax,
    data?.phone_2,
    data?.phone2,
    CONTACT_FALLBACKS.fax
  );
  const contactEmail = firstText(
    data?.email,
    data?.email_support,
    data?.mail,
    CONTACT_FALLBACKS.email
  );
  const contactIntro =
    language == "ar"
      ? firstText(data?.contact_intro_ar, data?.contact_intro, data?.contactIntroAr)
      : firstText(data?.contact_intro_en, data?.contact_intro, data?.contactIntroEn);
  
  return (
    <div className="me_cotactUs_page rowDiv">
      <Breadcrumb links={breadCrumb} />

      <div className="me_contactUs_cotainer">
        <div className="left_section">
          <div className="image">
            <div className="left_content">
              <div className="map_info">
                <div
                  className=""
                  style={{ zIndex: 123 }}
                  onClick={() => window.open(data?.map_url || "", "_blank")}
                >
                  <iframe
                    className="contact_map"
                    src={
                      data?.map_url ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.307053322222!2d31.45404992567111!3d30.199782611196362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581a9954fd0425%3A0x3303686a7c8ac8b6!2z2KfZhNi52LHZiNio2Kkg2YTYtdmG2KfYudipINin2YTZhdmI2KfYryDYp9mE2LrYsNin2KbZitipINio2LPZhdip!5e0!3m2!1sar!2seg!4v1714378113955!5m2!1sar!2seg"
                    }
                    style={{ border: 0, zIndex: -1, position: "relative" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="contact_info">
                  <div className="contact_info_row">
                    <div className="icon">{HouseIcon}</div>
                    <div className="info">{contactAddress}</div>
                  </div>
                  <div className="contact_info_row">
                    <div className="icon">{SupportIcon}</div>
                    <div className="info">{formatContactNumber(contactPhone)}</div>
                  </div>
                  <div className="contact_info_row">
                    <div className="icon">{Printer}</div>
                    <div className="info">{formatContactNumber(contactFax)}</div>
                  </div>
                  <div className="contact_info_row">
                    <div style={{ color: "#035297" }} className="icon">
                      {Email}
                    </div>
                    <div className="info">{contactEmail}</div>
                  </div>
                  <div className="contact_social_parents">
                    {socials &&
                      socials.map((itParent, indParent) => {
                        return (
                          <div className="parent_social" key={indParent}>
                            {itParent.image && <img src={itParent?.image} alt="" />}
                            <div className="me_social_icons">
                              {itParent.socials &&
                                itParent.socials.map((item, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="icon"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        window.open(item.link, "_blank")
                                      }
                                    >
                                      {item.image && <img
                                        src={item.image}
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          cursor: "pointer",
                                        }}
                                        alt=""
                                      />}
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
        </div>

        <div className="Right_section">
          <div className="title">
            {language == "ar" ? "اتصل بنا" : "Contact Us"}
          </div>

          <RichText
            as="p"
            html={
              contactIntro ||
              (language == "ar"
                ? "املأ النموذج وسيقوم فريقنا بالرد عليك."
                : "Fill up the form and our team will get back to you.")
            }
            className="fill_up"
          />

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
                value={contactData.type_inqury}
                onChange={(e) => {
                  setContactData({
                    ...contactData,
                    type_inqury: e.target.value,
                  });
                }}
                name=""
                id=""
              >
                <option value="">
                  {language == "ar"
                    ? "برجاء تحديد اختيار"
                    : "-Please choose an option-"}
                </option>
                {INQUIRY_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {language == "ar" ? option.ar : option.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="me_form_input">
              <div className="me_input_lable">
                {language == "ar" ? "رسالتك" : "Your Message"}
                <span className="req_star">*</span>
              </div>
              <textarea
                value={contactData.message}
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
                {mesSuc === true ? (
                  <p
                    style={{ textAlign: "center", color: "green" }}
                    className="success_mes"
                  >
                    {message}
                  </p>
                ) : mesSuc === false ? (
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
