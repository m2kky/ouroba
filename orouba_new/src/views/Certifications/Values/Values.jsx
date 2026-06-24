"use client";
import React from "react";
import UseGeneral from "../../../hooks/useGeneral";
import Value from "./Value/Value";
import RichText from "../../../components/RichText";

const Values = ({ valuesData, introText, title }) => {
  const { language } = UseGeneral();
  const fallbackIntro =
    language == "ar"
      ? `في العروبة، قيمنا هى أساس لكل ما نقوم به. فهي توجهنا في اتخاذ قراراتنا، وإجراءاتنا وتفاعلاتنا مع عملائنا، كما تعكس التزامنا بالنزاهة والتميز والمسؤولية الاجتماعية.`
      : "At Orouba, our values serve as the foundation of everything we do. They guide our decisions, actions, and interactions with our stakeholders, and reflect our commitment to integrity, excellence, and social responsibility.";
  const displayTitle = title || (language == "ar" ? "قيمنا" : "Our Values");
  
  return (
    <div className="certification_values">
      <h4 style={{ textAlign: "center" }}>
        <span style={{ textAlign: "center" }}>{displayTitle}</span>
      </h4>
      <RichText as="p" html={introText || fallbackIntro} />
      <div className="values">
        {valuesData &&
          valuesData.map((item, index) => {
            return <Value key={item.id || index} item={item} />;
          })}
      </div>
    </div>
  );
};

export default Values;
