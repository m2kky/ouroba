import axios from "axios";
import { useEffect, useState } from "react";
import WhoWeAreImg from "../../assets/images/industrial-park-factory-building-warehouse 1.png";
import Breadcrumb from "../../components/BreadCumbsLinks";
import { base_url } from "../../consts";
import UseGeneral from "../../hooks/useGeneral";
import styles from "./WhoWeAre.module.css";
import "./style.css";
export default function WhoWeAre() {
  const { language } = UseGeneral();
  const [siteData, setSiteData] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [productionSteps, setProductionSteps] = useState([]);
  const [features, setFeatures] = useState([]);
  const getData = () => {
    setPageLoading(true);
    axios
      .get(base_url + `pages/about_page`)
      .then((res) => {
        console.log(res);
        if (res.data.status == "success") {
          if (Array.isArray(res.data.result.section_texts)) {
            setSections(res.data.result.section_texts);
          }
          if (Array.isArray(res.data.result?.productionSteps)) {
            setProductionSteps(res.data.result?.productionSteps);
          }
          if (Array.isArray(res.data.result?.buildings)) {
            setBuildings(res.data.result?.buildings);
          }
          if (Array.isArray(res.data.result?.features)) {
            setFeatures(res.data.result?.features);
          }
          setSiteData(res.data.result.siteinfo);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const [isSmaller, setIsSmaller] = useState(false)
  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 500px)");

      if (mediaQuery.matches) {
        setIsSmaller(true)
      } else {
        setIsSmaller(false)

      }
    };

    updateMenuHeights();

    // Optionally, you can add a resize event listener to handle window resizing
    const handleResize = () => {
      updateMenuHeights();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window]);

  useEffect(() => {
    console.log(buildings);
  }, [buildings])
  return (
    <>
      {" "}
      <div className="rowDiv" style={{ marginTop: "39px" }}>
        <Breadcrumb
          links={[
            { name: language == "ar" ? "الصفحةالرئيسية" : "Home", route: "/" },
            { name: language == "ar" ? "عن العروبة" : "About US" },
            {
              name: language == "ar" ? "من نحن" : "Who We Are ",
              active: true,
            },
          ]}
        />
      </div>
      <div
        className={`px-4 my-5 text-start downHeaderDiv whoweare rowDiv ${styles.pageContainer}`}
      >
        <div className={`row ${styles.Pagerow} whowearestyles`}>
          <div className="col">
            {console.log(siteData)}
            <img
              // style={{marginBottom:'40px'}}
              src={isSmaller ? siteData?.small_about_img : siteData?.about_image}
              alt="who we are image"
              className={`${styles.img} whowearestylesimg`}
            />
          </div>
          {/* <div style={{marginTop:'20px'}} className={`col ${styles.homeTxt} whowearebegad`}>
          <h2>{language == "en" ? "WHO WE ARE ?" : "من نحن ؟"}</h2>
          <p>
            {language == "en"?siteData?.how_we_are_en:siteData?.how_we_are_ar}
          </p>
        </div> */}
        </div>
        {sections &&
          sections.map((item, index) => {
            console.log(item)
            return (
              <div className={styles.label + " whowearestyleslabel"}>
                <h3
                  style={
                    language == "en"
                      ? { textAlign: "left" }
                      : { textAlign: "right" }
                  }
                  className="whowearestylesh3"
                >
                  {language == "en" ? item.title_en : item.title_ar}
                </h3>
                <p
                  className="whowearestylesp"

                  dangerouslySetInnerHTML={{
                    __html: language == "en" ? item.text_en : item.text_ar,
                  }}
                  style={
                    language == "en"
                      ? { textAlign: "left", marginRight: "auto" }
                      : { textAlign: "right", marginLeft: "auto" }
                  }
                // className="w-75"
                ></p>
              </div>
            );
          })}
        {/* <div className={styles.label}>
        <h3
          style={
            language == "en" ? { textAlign: "left" } : { textAlign: "right" }
          }
        >
          {language == "en" ? "Our Purpose" : "هدفنا"}
        </h3>
        <p
          style={
            language == "en"
              ? { textAlign: "left", marginRight: "auto" }
              : { textAlign: "right", marginLeft: "auto" }
          }
          // className="w-75"
        >
          {language == "en"
            ? "We believe food brings people together. That’s why we offer a wide range of delicious frozen products, from fresh veggies, fruits, and beans to flavorful falafel and appetizers. We're always innovating to offer exciting new choices made with simple, all-natural ingredients. We make in-the- kitchen expereices easy, quick and fun for everyone. Our aim is to inspire joyful mealtimes and help you share the magic of food with your loved ones."
            : "تم إنشاء المصنع على مساحة 20 ألف متر مربع بالمنطقة الصناعية الأولى - مدينة العبور الصناعية ويتكون المصنع من المرافق التالية:"}
        </p>
      </div>
      <div className={styles.label}>
        <h3
          style={
            language == "en" ? { textAlign: "left" } : { textAlign: "right" }
          }
        >
          {language == "en" ? "Our Factory" : "مصنعنا"}
        </h3>
        <p
          style={
            language == "en"
              ? { textAlign: "left", marginRight: "auto" }
              : { textAlign: "right", marginLeft: "auto" }
          }
          // className="w-75"
        >
          {language == "en"
            ? "constructed over an area of 20,000 square meters in the first industrial zone - El- Obour industrial city the factory is consists of the following facilities:"
            : "تم إنشاء المصنع على مساحة 20 ألف متر مربع بالمنطقة الصناعية الأولى - مدينة العبور الصناعية ويتكون المصنع من المرافق التالية:"}
        </p>
      </div> */}

        <div
          className={`row text-center mt-4 ${styles.buildingsContainer} buildingsContainer`}
        >
          {buildings &&
            buildings.map((item, index) => {
              return (
                <div className={`col d-flex gap-2 ${styles.buildingRow}`}>
                  {/* <img src={Building1Img} alt="building 1 img" /> */}
                  <div>
                    <h4>{language == "en" ? item?.title_en : item?.title_ar}</h4>
                    <p>
                      {language == "en"
                        ? item?.description_en
                        : item?.description_ar}
                    </p>
                  </div>
                </div>
              );
            })}
          {/* <div className={`col d-flex gap-2 ${styles.buildingRow}`}>
          <img src={Building1Img} alt="building 1 img" />
          <div>
            <h4>{language == "en" ? "Building A" : "مبني  A"}</h4>
            <p>
              {language == "en"
                ? "Administrative building comprising three floors to host all the factory departments."
                : "مبنى إداري يتكون من ثلاثة طوابق ليستضيف كافة أقسام المصنع."}
            </p>
          </div>
        </div> */}

          {/* <div className={`col d-flex gap-2 ${styles.buildingRow}`}>
          <img src={Building2Img} alt="building 2 img" />
          <div>
            <h4>{language == "en" ? "Building B" : "مبني B"}</h4>
            <p>
              {language == "en"
                ? "Factory building comprising two floors: The ground floor for raw materials receiving and preparation. group of belts and lift pumps uplifts the raw materials to the following floor for processing."
                : "مبنى المصنع مكون من طابقين: الدور الأرضي لاستلام وتحضير المواد الأولية. تقوم مجموعة من الأحزمة ومضخات الرفع برفع المواد الخام إلى الطابق التالي للمعالجة."}
            </p>
          </div>
        </div> */}
        </div>

        <div className="mt-5 AreaRow">
          <div
            style={{ rowGap: "20px" }}
            className={`row my-4 ${styles.rowBoxes}`}
          >
            {Array.from(
              {
                length: Math.ceil(features.length / 3),
              },
              (_, index) => (
                <div style={{ flexWrap: "wrap" }} key={index} className="row">
                  {features.slice(index * 3, (index + 1) * 3).map((item) => (
                    <div className={`col ${styles.imgContainer} imgContainer`}>
                      <img src={item.image} alt="Area Img" />
                      <h5>
                        <b>{language == "en" ? item?.title_en : item?.title_ar}</b>
                      </h5>
                      <p className="w-75">
                        {language == "en"
                          ? item?.description_en
                          : item?.description_ar}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* <div className={`row ${styles.rowBoxes}`}>
          <div className={`col ${styles.imgContainer}`}>
            <img src={areaImg} alt="Area Img" />
            <h5>{language == "en" ? "Area" : "المنطقة"}</h5>
            <p>
              {language == "en"
                ? "We own a large factory space spanning 20,000 square meters"
                : "نحن نملك مساحة مصنع كبيرة تبلغ 20,000 متر مربع"}
            </p>
          </div>

          <div className={`col ${styles.imgContainer}`}>
            <img src={employeesImg} alt="Area Img" />
            <h5>{language == "en" ? "Employees" : "موظفين"}</h5>
            <p>
              {language == "en"
                ? "At our disposal are over 700 dedicated employees who contribute to our company's success"
                : "يوجد تحت تصرفنا أكثر من 700 موظف متخصص يساهمون في نجاح شركتنا"}
            </p>
          </div>

          <div className={`col ${styles.imgContainer}`}>
            <img src={capacityImg} alt="Area Img" />
            <h5>{language == "en" ? "Capacity" : "سعة"}</h5>
            <p>
              {language == "en"
                ? "Our capacity for individually quick frozen (IQF) vegetables reaches 25,000 units per hour."
                : "تصل قدرتنا على الخضروات المجمدة السريعة بشكل فردي (IQF) إلى 25,000 وحدة في الساعة."}
            </p>
          </div>
        </div>

        <div className={`row my-4 ${styles.rowBoxes}`}>
          <div className={`col ${styles.imgContainer}`}>
            <img src={capacityProduct} alt="Area Img" />
            <h5>
              {language == "en"
                ? "Capacity for breaded products"
                : "القدرة على المنتجات المخبوزة"}
            </h5>
            <p className="w-75">
              {language == "en"
                ? "Our capacity for breaded products amounts to 1,800 tons per year."
                : "تبلغ قدرتنا على المنتجات المخبوزة 1800 طن سنويًا."}
            </p>
          </div>

          <div className={`col  ${styles.imgContainer}`}>
            <img src={capacityOverAll} alt="Area Img" />
            <h5>
              {language == "en"
                ? "Overall cold store capacity"
                : "القدرة الإجمالية لمخزن التبريد"}
            </h5>
            <p className="w-75">
              {language == "en"
                ? "Our extensive cold storage capacity totals 10,000 tons."
                : "تبلغ سعة التخزين البارد الواسعة لدينا 10,000 طن."}
            </p>
          </div>
        </div> */}
          {/* <div className="features">
          {
            features&&features.map((item,index)=>{
              return (
                <div className={`col ${styles.imgContainer}`}>
                  <img src={areaImg} alt="Area Img" />
                  <h5>{language == "en" ? "Area" : "المنطقة"}</h5>
                  <p>
                    {language == "en"
                      ? "We own a large factory space spanning 20,000 square meters"
                      : "نحن نملك مساحة مصنع كبيرة تبلغ 20,000 متر مربع"}
                  </p>
                </div>
              )
            })
          }
        </div> */}
        </div>
        <div className="ProductionSteps">
          <h4 style={{ fontSize: "40px", color: "#035297" }}>
            {language == "ar" ? "مراحل الإنتاج" : "Production Steps"}
          </h4>
          <div className="pord_steps_content">
            {productionSteps &&
              productionSteps.map((item, index) => {
                return (
                  <>
                    {index % 2 == 0 ? (
                      <div className="even">
                        <div className="img">
                          <img src={item.image} alt="" />
                        </div>
                        <div
                          className="rich_text"
                          dangerouslySetInnerHTML={{
                            __html:
                              language == "ar" ? item.text_ar : item.text_en,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <div className="odd">
                        <div
                          className="rich_text"
                          dangerouslySetInnerHTML={{
                            __html:
                              language == "ar" ? item.text_ar : item.text_en,
                          }}
                        ></div>
                        <div className="img">
                          <img src={item.image} alt="" />
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
          {/* <h1 style={{fontSize:"40px", color:"#035297",}}><b>Production Steps</b></h1>
        <ul style={{fontSize:"18px", color:"#035297",padding:"0 10px", display:"flex", flexDirection:"column", gap:"16px", margin:"40px 0 0"}}>
          <li>
            <b>Receiving, inspection and Selection process:</b>
            <span>
              {"    "}
              we carefully select the fresh vegetables, and make sure they are
              ripe to be tender and enjoy a delicious taste. Different selection
              processes are applied due to the difference in products nature.
            </span>
          </li>
          <li>
            <b>Sorting and washing:</b>
            <span>
            {"     "}
               vegetables undergo thorough sorting to ensure defect free
              products. They are then subjected to washing procedure to get the
              clean products we serve.
            </span>
          </li>
          <li>
            <b>Blanching:</b>
            {"   "}

            <span> Blanching time depends on the type of vegetables.</span>
          </li>
          <li>
            <b>Cooling:</b>
            <span>
               {"     "}
               This prepares for IQF process. It is done immediately after
              blanching.
            </span>
          </li>
          <li>
            <b>Packing:</b>
            <span>  the products under go several packing processes.</span>
          </li>
          <li>
            <b>Freezing:</b>
            <span>
              {"     "}
               The IQF process ensures maintaining the products attributes and
              nutrients.
            </span>
          </li>
        </ul> */}
          <center
            className="rowDiv"
            style={{
              display: "flex",
              color: "#035297",
              fontSize: "23px",
              margin: "",
              textAlign: "center !important"
            }}
          >
            {"    "}
            {language == "ar" ?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="23"
                viewBox="0 0 35 23"
                fill="none"
              >
                <path
                  d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z"
                  fill="#035297"
                />
                <path
                  d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z"
                  fill="#035297"
                />
              </svg>
              :
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="23"
                viewBox="0 0 35 23"
                fill="none"
              >
                <path
                  d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z"
                  fill="#035297"
                />
                <path
                  d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z"
                  fill="#035297"
                />
              </svg>}

            <p className="rowDiv centeralized" style={{ textAlign: "center" }}>
              {language == "ar" ? siteData?.quotation_ar : siteData?.quotation_en}
            </p>

            {language == "ar" ? <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="23"
              viewBox="0 0 35 23"
              fill="none"
            >
              <path
                d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z"
                fill="#035297"
              />
              <path
                d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z"
                fill="#035297"
              />
            </svg> : <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="23"
              viewBox="0 0 35 23"
              fill="none"
            >
              <path
                d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z"
                fill="#035297"
              />
              <path
                d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z"
                fill="#035297"
              />
            </svg>}
          </center>
        </div>
      </div>
    </>
  );
}
