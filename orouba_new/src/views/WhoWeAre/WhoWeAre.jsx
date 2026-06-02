"use client";
import { useEffect, useState } from "react";
const WhoWeAreImg = '/missing-image.png';
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";


export default function WhoWeAre({ aboutData }) {
  const { language } = UseGeneral();
  const { sections, buildings, productionSteps, features, siteInfo: siteData } = aboutData;
  const [isSmaller, setIsSmaller] = useState(false);

  useEffect(() => {
    const updateMenuHeights = () => {
      const mediaQuery = window.matchMedia("(max-width: 500px)");
      setIsSmaller(mediaQuery.matches);
    };

    updateMenuHeights();

    const handleResize = () => {
      updateMenuHeights();
    };

    (typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener('resize', handleResize);

    return () => {
      (typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
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
        className={`px-4 my-5 text-start downHeaderDiv whoweare rowDiv ${"pageContainer"}`}
      >
        <div className={`row ${"Pagerow"} whowearestyles`}>
          <div className="col">
            <img
              src={isSmaller ? siteData?.small_about_img : siteData?.about_image}
              alt="who we are image"
              className={`${"img"} whowearestylesimg`}
            />
          </div>
        </div>
        {sections &&
          sections.map((item, index) => {
            return (
              <div key={item.id} className={"label" + " whowearestyleslabel"}>
                <h3
                  style={
                    language == "en"
                      ? { textAlign: "left" }
                      : { textAlign: "right" }
                  }
                  className="whowearestylesh3"
                >
                  {language == "en" ? item.titleEn : item.titleAr}
                </h3>
                <p
                  className="whowearestylesp"
                  dangerouslySetInnerHTML={{
                    __html: language == "en" ? item.textEn : item.textAr,
                  }}
                  style={
                    language == "en"
                      ? { textAlign: "left", marginRight: "auto" }
                      : { textAlign: "right", marginLeft: "auto" }
                  }
                ></p>
              </div>
            );
          })}

        <div
          className={`row text-center mt-4 ${"buildingsContainer"} buildingsContainer`}
        >
          {buildings &&
            buildings.map((item, index) => {
              return (
                <div key={item.id} className={`col d-flex gap-2 ${"buildingRow"}`}>
                  <div>
                    <h4>{language == "en" ? item?.titleEn : item?.titleAr}</h4>
                    <p>
                      {language == "en"
                        ? item?.descriptionEn
                        : item?.descriptionAr}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-5 AreaRow">
          <div
            style={{ rowGap: "20px" }}
            className={`row my-4 ${"rowBoxes"}`}
          >
            {Array.from(
              {
                length: Math.ceil(features?.length / 3),
              },
              (_, index) => (
                <div style={{ flexWrap: "wrap" }} key={index} className="row">
                  {features.slice(index * 3, (index + 1) * 3).map((item) => (
                    <div key={item.id} className={`col ${"imgContainer"} imgContainer`}>
                      <img src={item.image} alt="Area Img" />
                      <h5>
                        <b>{language == "en" ? item?.titleEn : item?.titleAr}</b>
                      </h5>
                      <p className="w-75">
                        {language == "en"
                          ? item?.descriptionEn
                          : item?.descriptionAr}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="ProductionSteps">
          <h4 style={{ fontSize: "40px", color: "#035297" }}>
            {language == "ar" ? "مراحل الإنتاج" : "Production Steps"}
          </h4>
          <div className="pord_steps_content">
            {productionSteps &&
              productionSteps.map((item, index) => {
                return (
                  <div key={item.id}>
                    {index % 2 == 0 ? (
                      <div className="even">
                        <div className="img">
                          <img src={item.image} alt="" />
                        </div>
                        <div
                          className="rich_text"
                          dangerouslySetInnerHTML={{
                            __html:
                              language == "ar" ? item.textAr : item.textEn,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <div className="odd">
                        <div
                          className="rich_text"
                          dangerouslySetInnerHTML={{
                            __html:
                              language == "ar" ? item.textAr : item.textEn,
                          }}
                        ></div>
                        <div className="img">
                          <img src={item.image} alt="" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

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
