"use client";
import React from 'react';
import { arrowLeft } from '../../../assets/svgIcons';
import UseGeneral from '../../../hooks/useGeneral';
import { useRouter } from 'next/navigation';
import { localizedPath } from '@/utils/routes';
function MapSection({ data }) {
  const { language } = UseGeneral();
  const router = useRouter();
  return (
    <div className="hero_section map_section d-flex justify-content-between w-full rowDiv">
      <div className="hero_texts d-flex flex-column align-item-start ">
        <h1>
          {language == "ar" ? "العروبة" : "Orouba"}
          <span> {language == "ar" ? "حول العالم" : "World Map"}</span>
        </h1>
        <p>
          {language == "ar"
            ? data?.world_text_ar
            : `${data?.world_text}`}
        </p>
        <button className="hone_sections_button d-flex"  onClick={() => router.push(localizedPath("/export", language))}>
          <span>{language == "ar" ? "المزيد" : "Learn More"}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {arrowLeft}
          </span>
        </button>
      </div>
      <img src={data?.map} />
    </div>
  );
}

export default MapSection;

