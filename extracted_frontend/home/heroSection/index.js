import React from 'react';
import { arrowLeft } from '../../../assets/svgIcons';
import "./style.css";
import UseGeneral from '../../../hooks/useGeneral';
function Hero({ data }) {
  const { language } = UseGeneral();

  return (
    <div className="hero_section d-flex justify-content-between w-full rowDiv">
      <img src={data?.vision_image} />
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {language == "ar" ? "من" : "From"}
          <span>
            {language == "ar" ? "الرؤية إلى الواقع" : "Vision to Reality"}
          </span>
        </h1>
        <p>{language == "ar" ? `${data?.vision_ar}` : `${data?.vision_en}`}</p>
        <button className="hone_sections_button d-flex" onClick={()=>window.location.href  = "/about/whoWeAre"}>
          <span>{language == "ar" ? "عن العروبة" : "About Us"}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Hero;
