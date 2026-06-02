"use client";
import React from 'react';
import Breadcrumb from '../../components/BreadCumbsLinks';
import ExportForm from '../Export/ExportForm/ExportForm';
import UseGeneral from '../../hooks/useGeneral';

const ExportCatalog = ({ exportCatData }) => {
  const {language} = UseGeneral();

  const pages = [
    {
      name: language == "ar" ? 'الرئيسية' : 'Home',
      title_ar: 'الرئيسية',
      title_en: 'Home',
      route: '/',
    },
    {
      name: language == "ar" ? 'التصدير' : 'Export Catalogue',
      title_ar: 'التصدير',
      title_en: 'Export Catalogue',
      active: true,
    },
  ];

  return (
    <div className="export_catalog_page">
      <Breadcrumb links={pages} />
      <div className="cat_expo_ban rowDiv">
        <div className="left">
          <h5>{language == "ar" ? "مرحبا بكم في تصدير الكتالوج":"Welcome To Export Catalogue"}</h5>
          <p>{language == "en" ? exportCatData?.catalogEn: exportCatData?.catalogAr}</p>
          <em
            className="btn btn-primary"
            onClick={() => window.open(exportCatData?.catalogFile, "_blank")}
            style={{ background: "var(--main-color)" }}
          >
            {language == "ar" ? "تحميل الكتالوج":"Download Catalogue"}
          </em>
        </div>
        <div className="right">
          {exportCatData?.catalogImage ? (
            <img src={exportCatData.catalogImage} alt="" />
          ) : null}
        </div>
      </div>
      <div className="rowDiv">
        <ExportForm />
      </div>
    </div>
  );
};

export default ExportCatalog;
