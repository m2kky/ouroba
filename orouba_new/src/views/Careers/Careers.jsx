"use client";
import { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import styles from "./Careers.module.css";
import Breadcrumb from "../../components/BreadCumbsLinks";
import { ThreeDots } from "react-loader-spinner";
import RichText from "../../components/RichText";

export default function Careers({ careerData }) {
  const { language } = UseGeneral();
  const [joinData, setJoinData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    cover_letter: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sucMess, setSucMess] = useState("");
  const WhyData = Array.isArray(careerData?.whyChooseUs) ? careerData.whyChooseUs : [];
  const getWhyText = (item) =>
    language == "en"
      ? item?.descriptionEn || item?.description_en || item?.textEn || item?.text_en
      : item?.descriptionAr || item?.description_ar || item?.textAr || item?.text_ar;

  useEffect(() => {
    if (sucMess == true || sucMess == false) {
      setTimeout(() => {
        setSucMess("");
        setMessage("");
      }, 2000);
    }
  }, [sucMess]);
  const join = async (e) => {
    e.preventDefault();
    setJoinLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", joinData.name);
      formData.append("email", joinData.email);
      formData.append("phone", joinData.phone);
      formData.append("position", joinData.position);
      formData.append("message", joinData.message);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.success !== false) {
        setSucMess(true);
        setMessage(
          language == "en"
            ? "Your application has been submitted."
            : "تم إرسال طلب التوظيف بنجاح."
        );
        setJoinData({
          name: "",
          email: "",
          phone: "",
          position: "",
          cover_letter: "",
          message: "",
        });
        setFile(null);
      } else {
        setSucMess(false);
        setMessage(result?.error || result?.message || (language == "en" ? "Request failed." : "تعذر إرسال الطلب."));
      }
    } catch {
      setSucMess(false);
      setMessage(language == "en" ? "Request failed." : "تعذر إرسال الطلب.");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <>
      <div
        className={`my-5 px-5 ${styles.pageContainer}  careerContentstyle rowDiv`}
      >
        <Breadcrumb
          links={[
            { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
            { name: language == "ar" ? "الوظائف" : "Careers", active: true },
          ]}
        />
        <div
          className={`${styles.careerForm} careerContentForm`}
          style={{
            display: "flex",
            justifyContent: "center",
            marginInline: "auto",
            width: "100%",
          }}
        >
          <div
            className={styles.careerContent}
            style={{
              marginInline: "auto",
              maxWidth: "920px",
              width: "100%",
            }}
          >
            <div
              className={`${styles.careerTitle} ${language == "ar" ? styles.rtlCareerTitle : ""}`}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                marginInline: "auto",
                textAlign: "center",
                width: "100%",
              }}
            >
              <h2 style={{ textAlign: "center", width: "100%" }}>
                {language == "en" ? "Join Our Team" : "انضم إلى فريقنا"}
              </h2>
              <p
                style={{
                  marginInline: "auto",
                  maxWidth: "860px",
                  textAlign: "center",
                  width: "min(100%, 860px)",
                }}
              >
                {language == "en"
                  ? "If you are interested in joining our family, please send an email with your resume and cover letter to oroubamail@orouba.ajwa.com or fill out the employment form"
                  : `إذا كنت مهتمًا بالانضمام إلى عائلتنا، يرجى إرسال بريد إلكتروني يحتوي على سيرتك الذاتية وخطاب تقديمي إلى oroubamail@orouba.ajwa.com أو ملء نموذج التوظيف`}
              </p>
            </div>

            <form className={styles.form} onSubmit={(e) => join(e)}>
              <div className={styles.inputGroup}>
                <input
                  onChange={(e) => {
                    setJoinData({ ...joinData, name: e.target.value });
                  }}
                  value={joinData.name}
                  placeholder={
                    language == "en" ? "Full Name" : "اسمك بالكامل"
                  }
                  type="text"
                />
                <input
                  onChange={(e) => {
                    setJoinData({ ...joinData, email: e.target.value });
                  }}
                  value={joinData.email}
                  placeholder={
                    language == "en" ? "Email" : "البريد الإلكتروني"
                  }
                  type="email"
                />
              </div>

              <input
                onChange={(e) => {
                  setJoinData({ ...joinData, phone: e.target.value });
                }}
                value={joinData.phone}
                type="tel"
                placeholder={language == "en" ? "Your Number" : "رقم الهاتف"}
              />

              <input
                onChange={(e) => {
                  setJoinData({ ...joinData, position: e.target.value });
                }}
                value={joinData.position}
                type="text"
                placeholder={language == "en" ? "Position" : "الوظيفة"}
              />

              <div className={styles.coverLetter}>
                <p>
                  {language == "en" ? "Upload CV" : "ارفع السيرة الذاتية"}
                </p>
                <input
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                  id="cover_file"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className={styles.cover_file}
                />
                <label htmlFor="cover_file" className={styles.chooseFile}>
                  {file?.name || (language == "en" ? "Choose file" : "اختر ملف")}
                </label>
              </div>

              <textarea
                onChange={(e) => {
                  setJoinData({ ...joinData, message: e.target.value });
                }}
                value={joinData.message}
                placeholder={language == "en" ? "Your Message" : "رسالة منك"}
              ></textarea>
              {sucMess !== "" ? (
                <>
                  {" "}
                  {sucMess ? (
                    <p style={{ textAlign: "center", color: "green" }}>
                      {message}
                    </p>
                  ) : !sucMess ? (
                    <p style={{ textAlign: "center", color: "red" }}>
                      {message}
                    </p>
                  ) : null}
                </>
              ) : null}
              {joinLoading ? (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThreeDots color="#035297" />
                </div>
              ) : (
                <button
                  className={styles.submitBtn + " " + "CareersBtn"}
                  type="submit"
                >
                  {language == "en" ? "Send" : "إرسال"}
                </button>
              )}
            </form>
          </div>
        </div>

        <div className={`${styles.chooses} chooses`}>
          <div className={styles.chooseUsTitle}>
            <h2 className="H2InLarge">
              {language == "en" ? "Why Choose Us ?" : "لماذا تختار العمل معنا؟ "}
            </h2>
            <p>
              {language == "en"
                ? "We believe in fostering talent, encouraging growth and providing opportunities for individuals to achieve their full potential"
                : "نحن نؤمن بتعزيز المواهب وتشجيع النمو وتوفير الفرص للأفراد لتحقيق إمكاناتهم الكاملة"}
            </p>
          </div>

          <div className={`row mt-4 ${styles.boxContainer} `}>
            <div className={`col ${styles.choosesBoxes} ms-4`}>
              {WhyData?.map((item, index) => {
                if (index < Math.floor(WhyData.length / 2)) {
                  return (
                    <div className={styles.box} key={item.id || index}>
                      <div>{index + 1}</div>
                      <RichText as="p" html={getWhyText(item)} />
                    </div>
                  );
                }
                return null;
              })}

              {/* <div className={styles.box}>
                <div>1</div>
                <p>
                  {language == "en"
                    ? "Dynamic Work Environment"
                    : "بيئة عمل مرنه"}
                </p>
              </div>

              <div className={styles.box}>
                <div>2</div>
                <p>
                  {language == "en" ? "Career Development" : "التطوير الوظيفي"}
                </p>
              </div>

              <div className={styles.box}>
                <div>3</div>
                <p>
                  {language == "en" ? "Opportunities for Growth" : "فرص للنمو"}
                </p>
              </div> */}
            </div>

            <div className={`col ${styles.choosesBoxes}`}>
              {WhyData?.map((item, index) => {
                if (index > Math.floor(WhyData.length / 2) - 1) {
                  return (
                    <div className={styles.box} key={item.id || index}>
                      <div>{index + 1}</div>
                      <RichText as="p" html={getWhyText(item)} />
                    </div>
                  );
                }
                return null;
              })}{" "}
              {/* <div className={styles.box}>
                <div>4</div>
                <p>
                  {language == "en" ? "Competitive Benefits" : "فوائد تنافسية"}
                </p>
              </div>

              <div className={styles.box}>
                <div>5</div>
                <p>{language == "en" ? "Make a Difference" : "احداث فرق"}</p>
              </div>

              <div className={styles.box}>
                <div>6</div>
                <p>
                  {language == "en"
                    ? "Innovation and Creativity Challenges"
                    : "تحديات الابتكار والإبداع"}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
