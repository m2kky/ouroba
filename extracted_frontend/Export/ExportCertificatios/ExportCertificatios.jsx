import React, { useEffect, useState } from 'react';
import UseGeneral from '../../../hooks/useGeneral';
import { certificationsData } from './data';
import './ExportCertificatios.css';
import { arrowLeft } from '../../../assets/svgIcons';
import ContentLoader from 'react-content-loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
const ExportCertificatios = ({ showTit, certificationsData }) => {
  const { language } = UseGeneral();
  const [certifications, setCertifications] = useState([]);
  const navigate = useNavigate()
  const getCerts = () => {
    setCertifications(certificationsData);
  };
  useEffect(() => {
    getCerts();
  }, [certificationsData]);
  return (
    <div
      className={
        showTit ? "export_certificatios export_certificatios_page" : "export_certificatios min_mar export_certificatios_page"
      }
    >
      {showTit && (
        <h4>
          {language == 'ar' ? (
            <>
              <span>
                الشهادات الحاصلة عليها العروبة
              </span>
            </>
          ) : (
            <>
              <span>Orouba </span>
              <span>Certifications</span>
            </>
          )}
        </h4>
      )}
      <div
        className={showTit ? "certifications hideFromMobile" : "certifications not_make_hide hideFromMobile"}
      >
        {certifications && certifications?.length
          ? certifications.map((item, index) => {
            return (
              <div className="certification">
                <img src={item.image} alt="" />
              </div>
            );
          })
          : null}
      </div>

      <Swiper
        className={showTit ? 'cert_swiper' : 'cert_swiper make_hide'}
        style={{ width: '100%' }}
        // loop={true}
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 3,
            spaceBetween: 30,
          },

          1500: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {false ? (
          <ContentLoader />
        ) : certifications?.length ? (
          certifications?.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                {/* <Standard
                        title={item?.title}
                        description={language =="ar" ? item?.description_ar: item?.description_en}
                        icon={item?.image}
                      /> */}
                <img style={{ maxWidth: '100%' }} src={item.image} alt="" />
              </SwiperSlide>
            );
          })
        ) : null}
      </Swiper>

      {showTit && (
        <button className="hoverable certificationsHoverable" onClick={() => navigate("/ExportCatalog")}>
          {language == "ar" ? "تحميل الكتالوج" : "Export Catalogue"}
          <span style={{ rotate: language == "ar" ? "180deg" : "0" }}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="28"
                viewBox="0 0 33 28"
                fill="none"
              >
                <path
                  d="M13.1895 8.13765L19.8101 13.7239L13.1895 19.3101"
                  stroke="white"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          </span>
        </button>
      )}
    </div>
  );
};

export default ExportCertificatios;
