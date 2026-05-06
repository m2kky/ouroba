import React, { useEffect, useState } from "react";
import "./Values.css";
import UseGeneral from "../../../hooks/useGeneral";
// import { valuesData } from './data'
import Value from "./Value/Value";
const Values = ({ valuesData }) => {
  const { language } = UseGeneral();
  const [values, setValues] = useState([]);
  const getValues = () => {
    setValues(valuesData);
  };
  useEffect(() => {
    getValues();
  }, []);
  return (
    <div className="certification_values">
      <h4 style={{ textAlign: "center !important" }}>
        {language == "ar" ? (
          <>
            <span style={{ textAlign: "center !important" }}>قيمنا</span>
          </>
        ) : (
          <>
            <span>Our </span>{" "}
            <span> Values</span>
          </>
        )}
      </h4>
      <p>
        {language == "ar"
          ? `في العروبة، قيمنا هى أساس لكل ما نقوم به. فهي توجهنا في اتخاذ قراراتنا، وإجراءاتنا وتفاعلاتنا مع عملائنا، كما تعكس التزامنا بالنزاهة والتميز والمسؤولية الاجتماعية.`
          : "At Orouba, our values serve as the foundation of everything we do. They guide our decisions, actions, and interactions with our stakeholders, and reflect our commitment to integrity, excellence, and social responsibility."}
      </p>
      <div className="values">
        {values &&
          values.map((item, index) => {
            return <Value key={index} item={item} />;
          })}
      </div>
    </div>
  );
};

export default Values;
