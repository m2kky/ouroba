"use client";
import React from 'react';
import { arrowLeft } from '../../../assets/svgIcons';
import UseGeneral from '../../../hooks/useGeneral';
import { useRouter } from 'next/navigation';
import { localizedPath } from '@/utils/routes';
function Hero({ data }) {
  const { language } = UseGeneral();
  const router = useRouter();
  const visionText = language == "ar" ? data?.vision_ar : data?.vision_en;

  return (
    <div className="hero_section d-flex justify-content-between w-full rowDiv">
      {data?.vision_image ? <img src={data.vision_image} alt="" /> : null}
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {language == "ar" ? "من" : "From"}
          <span>
            {language == "ar" ? "الرؤية إلى الواقع" : "Vision to Reality"}
          </span>
        </h1>
        {visionText ? <p>{visionText}</p> : null}
        <button className="hone_sections_button d-flex" onClick={() => router.push(localizedPath("/about/whoWeAre", language))}>
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

