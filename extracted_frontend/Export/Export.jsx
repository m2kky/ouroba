import React, { useEffect, useState } from 'react';
import ExportBanner from './exportBanner/ExportBanner';
import Breadcrumb from '../../components/BreadCumbsLinks';
import UseGeneral from '../../hooks/useGeneral';
import ExportContries from './exportContries/ExportContries';
import ExportCertificatios from './ExportCertificatios/ExportCertificatios';
import ExportForm from './ExportForm/ExportForm';
import ExportStandars from './ExportStandars/ExportStandars';
import axios from 'axios';
import { BASE_URL } from '../../Axios/base_url';
import { ThreeDots } from 'react-loader-spinner';
import { base_url } from '../../consts';

const Export = () => {
  const { language } = UseGeneral();
  const [pages, setPages] = useState([
    {
      name: language == 'ar' ? 'الرئيسية' : 'Home',
      title_ar: 'الرئيسية',
      title_en: 'Home',
      path: '/',
    },
    {
      name: language == 'ar' ? 'التصدير' : 'Export',
      title_ar: 'التصدير',
      title_en: 'Export',
      path: '/export',
    },
  ]);
  const [pageLoading, setPageLoading] = useState(false)
  const [exportPage, setExportPage] = useState(null);
  const getExportPage = () => {
    setPageLoading(true)
    axios.get(base_url + `pages/export_page`)
      .then((res) => {
        console.log(res.data)
        if (res.data.status == 'success') {
          setExportPage(res.data.result)
        }
      })
      .catch(e => {
        console.log(e);

        setExportPage({})

      })
      .finally(() => {
        setPageLoading(false)
      })
  }
  useEffect(() => {
    getExportPage()
  }, [])
  return (
    <>
      {
        !exportPage ?
          (
            <div
              className="rowDiv"
              style={{
                minHeight: "50vh",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThreeDots color="var(--main-color" />
            </div>
          )
          :
          (
            <div className='export_page'>
              <div className="rowDiv" >
                <Breadcrumb links={pages} />
              </div>
              <ExportBanner exportData={exportPage?.siteinfo} />

              <div className=" rowDiv">
                {/* <RootPages pages={pages}/ > */}
                <ExportContries continentsData={exportPage?.continents?.filter(item => item?.hidden == 0)} />
                <div className="map">
                  <img
                    style={{ maxWidth: '100%', width: '100%' }}
                    src={exportPage?.siteinfo?.map}
                    alt=""
                  />
                </div>
                <ExportStandars standersData={exportPage?.standers} />
                <ExportCertificatios certificationsData={exportPage?.certifications} showTit={true} />
                <ExportForm />
              </div>
            </div>
          )
      }
    </>
  );
};

export default Export;
