import React from 'react';
import { arrowLeft } from '../../../assets/svgIcons';
import "./style.css";
import UseGeneral from '../../../hooks/useGeneral';
function WhyUs({data}) {
  const { language } = UseGeneral();
  return (
    <div className="hero_section d-flex justify-content-between align-items-center w-full rowDiv why_us_section">
      <img src={data?.why_orouba_img} />
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {language == "ar" ? "لماذا" : "Why"}
          <span>{language == "ar" ? "العروبة ؟" : "Orouba ?"}</span>
        </h1>
        <div className="hero_content">
          <h5>
            {language == "ar"
              ? "اكتشف الفرق في كل قضمة:"
              : "Discover the Difference in Every Bite:"}
          </h5>
          <p style={{padding:"10px"}}>
            {language != "ar"
              ? data?.why_orouba_en
              : data?.why_orouba_ar}
          </p>
        </div>
        <button className="hone_sections_button d-flex"  onClick={()=>window.location.href  = "/about/whoWeAre"}>
        <span>{language == "ar" ? "المزيد" : "Learn More"}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </button>
      </div>
    </div>
  );
}

export default WhyUs;
