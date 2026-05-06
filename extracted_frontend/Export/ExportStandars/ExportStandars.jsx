import React, { useEffect, useState } from 'react';
import './ExportStandars.css';
// import { standersData } from './data';
import UseGeneral from '../../../hooks/useGeneral';
import Standard from '../../../components/standards';
import { Link } from 'react-router-dom';
import { arrowLeft } from '../../../assets/svgIcons';
const ExportStandars = ({ standersData }) => {
  const { language } = UseGeneral();
  const [standars, setStanders] = useState([]);
  const eqData = () => {
    setStanders(standersData);
  }
  useEffect(() => {
    eqData()
  }, []);
  return (
    <div className="export_standars">
      <h4>
        {language == 'ar' ? (
          <>
            <span>معاييرنا</span>
          </>
        ) : (
          <>
            <span>Our</span>
            <span>Standards</span>
          </>
        )}
      </h4>
      <p style={{ textAlign: "center" }}>
        {language == "ar"
          ? "نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك."
          : `At Orouba, we hold ourselves to the highest standards to ensure that
        every product we deliver meets and exceeds your expectations.`}</p>
      <div className="standardsImages d-flex my-3 justify-content-between">
        {standars &&
          standars.map((item, index) => {
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
          })}
      </div>
      {/* <div className="hero_section standard_section d-flex justify-content-between flex-column w-full homeStandard rowDiv">
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
    </div> */}
    </div>
  );
};

export default ExportStandars;
