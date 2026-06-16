"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "../../components/BreadCumbsLinks";
import UseGeneral from "../../hooks/useGeneral";
import RichText from "../../components/RichText";

const ABOUT_FEATURES = [
  {
    id: "employees",
    titleAr: "الموظفون",
    titleEn: "Employees",
    descriptionAr: "أكثر من ٧٠٠ موظف متخصص يساهمون في نجاح شركتنا.",
    descriptionEn: "Over 700 dedicated employees who contribute to our company's success.",
    image:
      "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/about-features/1779366352578-4xn2qxvs8bf-vGmUdMMJnlqBDY7kiOhfibwQDMUjWlG019c6Z7hZ.png",
  },
  {
    id: "area",
    titleAr: "المساحة",
    titleEn: "Area",
    descriptionAr: "تبلغ المساحة الإجمالية لمصنعنا أكثر من ٢٠,٠٠٠ متر مربع.",
    descriptionEn: "Our factory is constructed over 20,000 square meters.",
    image:
      "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/features/1779202866861-e8shkiowoz6-0e9Yy5j3FdbU0DFTOXTWgrIeSaDRtunarfPxFmPh.webp",
  },
  {
    id: "capacity",
    titleAr: "السعة",
    titleEn: "Capacity",
    descriptionAr:
      "يبلغ حجم إنتاجنا من الخضروات المجمدة تجميدا سريعا IQF حوالي ٢٥٠٠٠ طن سنويا.",
    descriptionEn:
      "Our capacity for individual quick freezing (IQF) frozen vegetables reaches 25,000 tons per year.",
    image:
      "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/features/1779202867885-mgqnk3go3p-4d4nAa9sK4dB1xOtha56c8VIpjO3sxyWxfJtv3n6.webp",
  },
  {
    id: "prefried_capacity",
    titleAr: "السعة التخزينية للمنتجات النصف مطهية",
    titleEn: "Capacity for pre-fried products",
    descriptionAr:
      "تبلغ سعتنا التخزينية للمنتجات النصف مطهية حوالي ١٨٠٠ طن سنويا.",
    descriptionEn:
      "Our capacity for pre-fried products amounts to 1,800 tons per year.",
    image:
      "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/features/1779202868334-108iove1s7pr-YFrh6569OO6wE3mYThl0q1bb7L5zJqDOhoViwi71.webp",
  },
  {
    id: "cold_store_capacity",
    titleAr: "السعة الإجمالية لمخازن التبريد",
    titleEn: "Overall cold store capacity",
    descriptionAr:
      "تبلغ سعة التخزين البارد لدينا ١٠٠٠٠ طن سنويا، ٥٠٠٠ متر مربع.",
    descriptionEn:
      "Our cold storage capacity totals 10,000 tons per year, 5,000 m2.",
    image:
      "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/features/1779202868840-bncwqvazfw-dcqw4l4DMEZsoL3P4rLPzBqJPGRIstkT5BdxiabT.webp",
  },
];

const getLocalizedValue = (item, enKey, arKey, language) =>
  language == "en" ? item?.[enKey] : item?.[arKey];

const firstImage = (...sources) =>
  sources.find((source) => typeof source === "string" && source.trim());

const sortedVisibleItems = (items, sorter) => {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems
    .filter((item) => !item?.isHidden && !item?.hidden)
    .slice()
    .sort(sorter);
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const hasHtml = (value) => /<[a-z][\s\S]*>/i.test(String(value || ""));

const stepTextToHtml = (value) => {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  if (hasHtml(text)) {
    return text;
  }

  const colonIndex = text.indexOf(":");
  if (colonIndex > -1) {
    const title = escapeHtml(text.slice(0, colonIndex + 1));
    const body = escapeHtml(text.slice(colonIndex + 1).trim());
    return `<p><strong>${title}</strong> ${body}</p>`;
  }

  return `<p>${escapeHtml(text)}</p>`;
};

const productionGroups = (steps) => {
  const sortedSteps = sortedVisibleItems(
    steps,
    (a, b) => (a?.number ?? 999) - (b?.number ?? 999)
  );

  if (sortedSteps.length <= 2) {
    return sortedSteps.map((step) => [step]);
  }

  const midpoint = Math.ceil(sortedSteps.length / 2);
  return [sortedSteps.slice(0, midpoint), sortedSteps.slice(midpoint)].filter(
    (group) => group.length > 0
  );
};

const groupImage = (group) => group.find((step) => step?.image)?.image;

const groupHtml = (group, language) =>
  group
    .map((step) =>
      stepTextToHtml(
        getLocalizedValue(step, "textEn", "textAr", language) ||
          getLocalizedValue(step, "text_en", "text_ar", language)
      )
    )
    .filter(Boolean)
    .join("");


export default function WhoWeAre({ aboutData }) {
  const { language } = UseGeneral();
  const { sections, buildings, productionSteps, siteInfo: siteData } = aboutData;
  const [isSmaller, setIsSmaller] = useState(false);
  const visibleSections = sortedVisibleItems(
    sections,
    (a, b) => (a?.number ?? 999) - (b?.number ?? 999)
  );
  const visibleBuildings = sortedVisibleItems(buildings, () => 0);
  const productionStepGroups = productionGroups(productionSteps);
  const heroImage = firstImage(
    isSmaller ? siteData?.small_about_img : null,
    siteData?.about_image,
    siteData?.about_image_2,
    siteData?.about_image_1
  );
  const productionNote =
    language == "ar"
      ? siteData?.about_production_note_ar || siteData?.quotation_ar
      : siteData?.about_production_note_en || siteData?.quotation_en;

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
          <div className="col aboutFactoryImageWrap">
            {heroImage ? (
              <img
                src={heroImage}
                alt="who we are image"
                className={`${"img"} whowearestylesimg aboutFactoryImage`}
              />
            ) : null}
          </div>
        </div>
        {visibleSections &&
          visibleSections.map((item) => {
            return (
              <div key={item.id} className={"label" + " whowearestyleslabel"}>
                <RichText
                  as="h3"
                  html={language == "en" ? item.titleEn : item.titleAr}
                  style={
                    language == "en"
                      ? { textAlign: "left" }
                      : { textAlign: "right" }
                  }
                  className="whowearestylesh3"
                />
                <RichText
                  as="p"
                  html={language == "en" ? item.textEn : item.textAr}
                  className="whowearestylesp"
                  style={
                    language == "en"
                      ? { textAlign: "left", marginRight: "auto" }
                      : { textAlign: "right", marginLeft: "auto" }
                  }
                />
              </div>
            );
          })}

        <div
          className={`row text-center mt-4 ${"buildingsContainer"} buildingsContainer`}
        >
          {visibleBuildings &&
            visibleBuildings.map((item) => {
              return (
                <div key={item.id} className={`col d-flex gap-2 ${"buildingRow"}`}>
                  <div>
                    <RichText
                      as="h4"
                      html={language == "en" ? item?.titleEn : item?.titleAr}
                    />
                    <RichText
                      as="p"
                      html={language == "en" ? item?.descriptionEn : item?.descriptionAr}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-5 AreaRow">
          <div className="aboutHardcodedFeatures">
            {ABOUT_FEATURES.map((item) => (
              <div key={item.id} className="aboutHardcodedFeature">
                <img src={item.image} alt={language == "en" ? item.titleEn : item.titleAr} />
                <h5>{language == "en" ? item.titleEn : item.titleAr}</h5>
                <p>{language == "en" ? item.descriptionEn : item.descriptionAr}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ProductionSteps">
          <h4 style={{ fontSize: "40px", color: "#035297" }}>
            {language == "ar" ? "مراحل الإنتاج" : "Production Steps"}
          </h4>
          <div className="pord_steps_content">
            {productionStepGroups &&
              productionStepGroups.map((group, index) => {
                const image = groupImage(group);
                const html = groupHtml(group, language);
                return (
                  index % 2 == 0 ? (
                    <div key={group.map((item) => item.id).join("-")} className="even">
                      <div className="img">
                        {image ? <img src={image} alt="" /> : null}
                      </div>
                      <div
                        className="rich_text"
                        dangerouslySetInnerHTML={{ __html: html }}
                      ></div>
                    </div>
                  ) : (
                    <div key={group.map((item) => item.id).join("-")} className="odd">
                      <div
                        className="rich_text"
                        dangerouslySetInnerHTML={{ __html: html }}
                      ></div>
                      <div className="img">
                        {image ? <img src={image} alt="" /> : null}
                      </div>
                    </div>
                  )
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

            <RichText
              as="p"
              html={productionNote}
              className="rowDiv centeralized"
              style={{ textAlign: "center" }}
            />

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
