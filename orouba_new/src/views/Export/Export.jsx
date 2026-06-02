"use client";
import React from 'react';
import ExportBanner from './exportBanner/ExportBanner';
import Breadcrumb from '../../components/BreadCumbsLinks';
import UseGeneral from '../../hooks/useGeneral';
import ExportContries from './exportContries/ExportContries';
import ExportCertificatios from './ExportCertificatios/ExportCertificatios';
import ExportForm from './ExportForm/ExportForm';
import ExportStandars from './ExportStandars/ExportStandars';

const Export = ({ exportPage }) => {
  const { language } = UseGeneral();
  
  const pages = [
    {
      name: language == 'ar' ? 'الرئيسية' : 'Home',
      title_ar: 'الرئيسية',
      title_en: 'Home',
      route: '/',
    },
    {
      name: language == 'ar' ? 'التصدير' : 'Export',
      title_ar: 'التصدير',
      title_en: 'Export',
      active: true,
    },
  ];

  return (
    <>
      <div className='export_page'>
        <div className="rowDiv" >
          <Breadcrumb links={pages} />
        </div>
        <ExportBanner exportData={exportPage?.siteinfo} />

        <div className=" rowDiv">
          <ExportContries continentsData={exportPage?.continents?.filter(item => item?.hidden == 0)} />
          <div className="map">
            {exportPage?.siteinfo?.exportMap ? (
              <img
                style={{ maxWidth: '100%', width: '100%' }}
                src={exportPage.siteinfo.exportMap}
                alt=""
              />
            ) : null}
          </div>
          <ExportStandars standersData={exportPage?.standers} />
          <ExportCertificatios certificationsData={exportPage?.certifications} showTit={true} />
          <ExportForm />
        </div>
      </div>
    </>
  );
};

export default Export;
