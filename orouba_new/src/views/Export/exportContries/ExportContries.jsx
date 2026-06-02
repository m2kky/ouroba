"use client";
import React from 'react';
import UseGeneral from '../../../hooks/useGeneral';

const ExportContries = ({ continentsData }) => {
  const { language } = UseGeneral();
  
  return (
    <div className="export_contries">
      <ul className="contries">
        {continentsData && continentsData?.length
          ? continentsData.map((item, index) => {
              return (
                <li className="content" key={item.id || index}>
                  <div className="circle"></div>
                  <div>
                    <span className="cont_name">
                      {language == 'ar' ? item?.nameAr : item?.nameEn}{" "}
                    </span>
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default ExportContries;
