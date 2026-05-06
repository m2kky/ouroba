import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../Axios/base_url';
import './ExportCatalog.css';
import Breadcrumb from '../../components/BreadCumbsLinks';
import ExportForm from '../Export/ExportForm/ExportForm';
import { ThreeDots } from 'react-loader-spinner';
import { base_url } from '../../consts';
import UseGeneral from '../../hooks/useGeneral';
const ExportCatalog = () => {
  const {language} = UseGeneral();
  const [pageLoading, setPageLoading] = useState(false);
  const [exportCatData, setExportCatData] = useState({});
  const [pages, setPages] = useState([
    {
      name: language == "ar" ? 'الرئيسية' : 'Home',
      title_ar: 'الرئيسية',
      title_en: 'Home',
      path: '/',
    },
    {
      name: language == "ar" ? 'التصدير' : 'Export Catalogue',
      title_ar: 'التصدير',
      title_en: 'Export Catalogue',
      path: '/export_cat',
    },
  ]);
  const getExpCatData = () => {
    setPageLoading(true);
    axios
      .get(base_url + 'pages/catalog_page')
      .then((res) => {
        console.log(res.data?.result);
        setExportCatData(res.data.result);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setPageLoading(false);
      });
  };
  useEffect(() => {
    getExpCatData();
  }, []);

  return (
    <>
      {pageLoading ? (
        <div
          style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThreeDots color="#035297" />
        </div>
      ) : (
        <div className="export_catalog_page">
          <Breadcrumb links={pages} />
          <div className="cat_expo_ban">
            <div className="left">
              <h5>{language == "ar" ? "مرحبا بكم في تصدير الكتالوج":"Welcome To Export Catalogue"}</h5>
              <p>{language == "en" ? exportCatData?.catalog_en: exportCatData?.catalog_ar}</p>
              <em
                className="btn btn-primary"
                onClick={() => window.open(exportCatData?.catalog_file, "_blanck")}
                style={{ background: "var(--main-color)" }}
              >
                {language == "ar" ? "تحميل الكتالوج":"Download Catalogue"}
              </em>
            </div>
            <div className="right">
              <img src={exportCatData?.catalog_image} alt="" />
            </div>
          </div>
          <ExportForm />
        </div>
      )}
    </>
  );
};

export default ExportCatalog;
