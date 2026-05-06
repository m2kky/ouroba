import React from "react";
import "./style.css";
import UseGeneral from "../../../hooks/useGeneral";
import { Link } from "react-router-dom";
import {
  WhiteArrowLeft,
  arrowLeft,
  arrowLeftBrand,
} from "../../../assets/svgIcons";
function WhyUs({ data, id }) {
  const { language } = UseGeneral();
  return (
    <div className="hero_section d-flex flex-column justify-content-between align-items-center w-full rowDiv why_us_section brands_section">
      {data?.brand?.main_image?.split(".")[
        data?.brand?.main_image?.split(".")?.length - 1
      ] != "mp4" ? (
        <img src={data?.brand?.main_image} />
      ) : (
        <video
          style={{ width: "100%", margin: "auto" }}
          src={data?.brand?.main_image}
          muted
          autoPlay
          loop
        ></video>
      )}
      <p style={{ color: "white" }}>
        {language == "ar"
          ? data?.brand?.description_ar
          : data?.brand?.description_en}
      </p>
      <center
        className="rowDiv"
        style={{
          display: "flex",
          color: "#035297",
          fontSize: "23px",
          margin: " 0  auto",
          textAlign:"center",
          maxWidth:"670px"
          // width: "100%",
        }}
      >
        {"    "}
        {language == "ar" ? 
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="23"
          viewBox="0 0 35 23"
          fill="none"
        >
          <path
            d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z"
            fill="#FFF100"
          />
          <path
            d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z"
            fill="#FFF100"
          />
        </svg>: 
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="23"
          viewBox="0 0 35 23"
          fill="none"
        >
          <path
            d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z"
            fill="#FFF100"
          />
          <path
            d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z"
            fill="#FFF100"
          />
        </svg>}
        <> {language == 'ar' ? (
               data?.brand?.brand_text_ar && data?.brand?.brand_text_ar ? (
                <p
                className="whyUs-text"
                style={{textAlign:"center"}}
                  dangerouslySetInnerHTML={{
                    __html:  data?.brand?.brand_text_ar,
                  }}
                ></p>
              ) : null
            ) :  data?.brand?.brand_text_en &&  data?.brand?.brand_text_en?.length ? (
              <p
              style={{textAlign:"center"}}
                dangerouslySetInnerHTML={{
                  __html:  data?.brand?.brand_text_en,
                }}
              ></p>
            ) : null}</>
        
        {language == "ar" ?<svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="23"
          viewBox="0 0 35 23"
          fill="none"
        >
          <path
            d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z"
            fill="#FFF100"
          />
          <path
            d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z"
            fill="#FFF100"
          />
        </svg> : <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="23"
          viewBox="0 0 35 23"
          fill="none"
        >
          <path
            d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z"
            fill="#FFF100"
          />
          <path
            d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z"
            fill="#FFF100"
          />
        </svg>}
      </center>
      {id == 8 ? (
        <Link
          className="btn btn-primary viewAllBtn"
          to={"/Brands/Basma/5/14/Frozen Pre-Fried Bites?q=14"}
          style={{ marginBottom: "113px" }}
        >
          <span>{language != "ar" ? "View All" : "إظهار الكل"}</span>
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {WhiteArrowLeft}
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export default WhyUs;
