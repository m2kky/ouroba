import React, { useEffect, useState } from "react";
import { arrowLeft } from "../../../assets/svgIcons";
import "./style.css";
import SectionTitle from "../../../components/sectionTitle";
import ContentLoader from "react-content-loader";
import Standard from "../../../components/standards";
import { Link } from "react-router-dom";
import UseGeneral from "../../../hooks/useGeneral";
function Standards({ data }) {
  console.log(data);
  const { language } = UseGeneral();
  const [standards, setStandards] = useState([
    {
      image: require("../../../assets/standard_1.svg").default,
      title: "",
      desc: "All products are free from any preservatives or chemical substances",
      desc_ar: "جميع المنتجات خالية من أي مواد حافظة أو كيماوية",
    },
    {
      image: require("../../../assets/standard_2.svg").default,
      title: "",
      desc: "All products undergo a selection, analysis process to choose the best and high-quality fresh produce only",
      desc_ar:
        "جميع المنتجات تخضع لعملية اختيار وتحليل لاختيار أفضل المنتجات الطازجة وذات الجودة العالية فقط",
    },
    {
      image: require("../../../assets/standard_3.svg").default,
      title: "",
      desc: "Deep –freeze compartment or freezer at (-18 C) 0 F",
      desc_ar:
        "المقصورة العميقة المجمدة أو الفريزر عند (-18 درجة مئوية) 0 فهرنهايت",
    },
  ]);
  useEffect(() => {
    setStandards(data);
  }, []);
  useEffect(()=>{

  },[])
  return (
    <div className="hero_section standard_section d-flex justify-content-between flex-column w-full homeStandard rowDiv">
      <SectionTitle
        minColorWord={"Our"}
        secondColorWordAr={"معاييرنا"}
        secondColorWord={"Standards"}
        classessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
        headerClassessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
      />
      <p
        className="text-center"
        style={{
          color: "var(--sec-color)",
          width: "80%",
          margin: "auto",
          fontSize: "23px",
          fontWeight: "400",
          textAlign:"center  !important"
        }}
      > 
        {language == "ar"
          ? "نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك."
          : "At Orouba, we hold ourselves to the highest standards to ensure that every product."}
      </p>
      <div className="standardsImages d-flex justify-content-between">
        {!standards ? (
          <ContentLoader />
        ) : standards?.length ? (
          standards?.map((item) => {
            return (
              <Standard
                title={item?.title}
                description={
                  language == "ar" ? item?.description_ar : item?.description_en
                }
                icon={item?.image}
                // backgroundInternal={true}
              />
            );
          })
        ) : null}
      </div>
      <Link to="/export">
        <span>{language == "ar" ? "المزيد" : "Learn More"}</span>
        <span
          style={{
            rotate: language == "ar" ? "180deg" : "0",
            display: "inline-block",
          }}
        >
          {arrowLeft}
        </span>
      </Link>
    </div>
  );
}

export default Standards;
