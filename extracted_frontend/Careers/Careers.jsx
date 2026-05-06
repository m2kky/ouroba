import { useEffect, useState } from "react";
import UseGeneral from "../../hooks/useGeneral";
import styles from "./Careers.module.css";
import "./style.css";
import Breadcrumb from "../../components/BreadCumbsLinks";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { base_url } from "../../consts";

export default function Careers() {
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
  const [joinD, setJoinD] = useState({});
  const [WhyData, setWhyData] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
    if (sucMess == true || sucMess == false) {
      setTimeout(() => {
        setSucMess("");
        setMessage("");
      }, 2000);
    }
  }, [sucMess]);
  const joinPageData = () => {
    setPageLoading(true);
    axios
      .get(base_url + "pages/join_page")
      .then((res) => {
        console.log(res.data.result);
        setJoinD(res.data.result);
        setWhyData(res.data.result.chooses);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  };
  const join = (e) => {
    e.preventDefault();
    setJoinLoading(true);
    // if(file==null){
    //   setSucMess(true);
    //   setMessage('Enter File');
    //   return
    // }
    const formData = new FormData();
    formData.append("image", file);
    axios
      .post(base_url + `img_upload`, formData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status == "success") {
          const data_send = {
            cover_letter: res.data.result.image,
            ...joinData,
          };
          axios
            .post(base_url + `joins/add_new`, data_send)
            .then((res2) => {
              if (res2.data.status) {
                setSucMess(true);
                setMessage(res2.data.message);
              } else if (res2.data.status == "faild") {
                setSucMess(false);
                setMessage(res2.data.message);
              } else {
                setSucMess(false);
                setMessage("Not Added");
              }
            })
            .catch((e) => console.log(e))
            .finally(() => {
              setJoinLoading(false);
            });
        } else if (res.data.status == "faild") {
          setSucMess(false);
          setMessage(res.data.message);
        } else {
          setSucMess(false);
          setMessage("Image Not Uploaded");
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    joinPageData();
  }, []);
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
        <div className={`${styles.careerForm} careerContentForm`}>
          <div className={styles.careerContent}>
            <div className={styles.careerTitle}>
              <h2>{language == "en" ? "Join Our Team" : "انضم إلى فريقنا"}</h2>
              <p>
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
                    language == "en" ? "Your Email" : "بريدك الالكتروني"
                  }
                  type="email"
                />
                <input
                  onChange={(e) => {
                    setJoinData({ ...joinData, email: e.target.value });
                  }}
                  value={joinData.email}
                  placeholder={
                    language == "en" ? "Your Fall Name" : "اسمك بالكامل"
                  }
                  type="text"
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
                  {language == "en" ? "Add Cover Letter" : "أضف خطاب تعريفي"}
                </p>
                <input
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  style={{ display: "none" }}
                  id="cover_file"
                  type="file"
                  className={styles.cover_file}
                />
                {/* {
                  file!=null&&
                  <img style={{width:'30px'}} src={require("../../assets/file.png")} alt="" />
                } */}
                <label htmlFor="cover_file" className={styles.chooseFile}>
                  {language == "en" ? "Choose file" : "اختر ملف"}
                </label>
              </div>

              <textarea
                onChange={(e) => {
                  setJoinData({ ...joinData, message: e.target.value });
                }}
                value={joinData.message}
                placeholder={language == "en" ? "Your Message" : "رسالة منك"}
              ></textarea>
              {sucMess && sucMess?.length ? (
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
                    <div className={styles.box}>
                      <div>{index + 1}</div>
                      <p>{language == "en" ? item.text_en : item?.text_ar}</p>
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
                    <div className={styles.box}>
                      <div>{index + 1}</div>
                      <p>{language == "en" ? item?.text_en : item?.text_ar}</p>
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
