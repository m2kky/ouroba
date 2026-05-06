import React, { useEffect, useState } from 'react';
import './RecipeAbout.css';
import { aboutData } from './data';
import UseGeneral from '../../../hooks/useGeneral';
const RecipeAbout = ({ data }) => {
  const { language } = UseGeneral();

  return (
    <div className="recipe_about rowDiv">
      <div className="left">
        <img src={data?.internal_image} alt="" />
      </div>

      <div className="right">
        {data?.step && data?.step?.length ? <h3><b>{language == "ar" ? "المكونات":"Ingredients"}</b></h3> : null}
        {data?.step?.map((item, index) => {
          return (
            <> {language == 'ar' ? (
              item?.step_ar && item?.step_ar?.length ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: item?.step_ar,
                  }}
                ></p>
              ) : null
            ) : item?.step_en && item?.step_en?.length ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: item?.step_en,
                }}
              ></p>
            ) : null}</>
          );
        })}
      </div>
      <div className={`bottom ${language =="ar" ? "active":""}`}>
        {data?.description_en && data?.description_en?.length ? (
          <h3><b>{language =="ar" ?"طريقة التحضير":"Instructions"}</b></h3>
        ) : null}
        {language == 'ar' ? (
          data?.description_ar && data?.description_ar?.length ? (
            <p
              dangerouslySetInnerHTML={{
                __html: data?.description_ar,
              }}
            ></p>
          ) : null
        ) : data?.description_en && data?.description_en?.length ? (
          <p
            dangerouslySetInnerHTML={{
              __html: data?.description_en,
            }}
          ></p>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeAbout;
