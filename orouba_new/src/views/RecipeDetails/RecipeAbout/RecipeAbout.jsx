import React from 'react';
import UseGeneral from '../../../hooks/useGeneral';

const RecipeAbout = ({ data }) => {
  const { language } = UseGeneral();

  return (
    <div className="recipe_about rowDiv">
      <div className="left">
        <img src={data?.internalImage} alt="" />
      </div>

      <div className="right">
        {data?.steps && data?.steps?.length ? <h3><b>{language == "ar" ? "المكونات":"Ingredients"}</b></h3> : null}
        {data?.steps?.map((item, index) => {
          return (
            <React.Fragment key={index}> {language == 'ar' ? (
              item?.stepAr && item?.stepAr?.length ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: item?.stepAr,
                  }}
                ></p>
              ) : null
            ) : item?.stepEn && item?.stepEn?.length ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: item?.stepEn,
                }}
              ></p>
            ) : null}</React.Fragment>
          );
        })}
      </div>
      <div className={`bottom ${language =="ar" ? "active":""}`}>
        {data?.descriptionEn && data?.descriptionEn?.length ? (
          <h3><b>{language =="ar" ?"طريقة التحضير":"Instructions"}</b></h3>
        ) : null}
        {language == 'ar' ? (
          data?.descriptionAr && data?.descriptionAr?.length ? (
            <p
              dangerouslySetInnerHTML={{
                __html: data?.descriptionAr,
              }}
            ></p>
          ) : null
        ) : data?.descriptionEn && data?.descriptionEn?.length ? (
          <p
            dangerouslySetInnerHTML={{
              __html: data?.descriptionEn,
            }}
          ></p>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeAbout;
