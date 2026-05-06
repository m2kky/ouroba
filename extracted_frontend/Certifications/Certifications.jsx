import React, { useEffect, useState } from 'react'
import './certifications.css'
import UseGeneral from '../../hooks/useGeneral'
import Breadcrumb from '../../components/BreadCumbsLinks'
import ExportCertificatios from '../Export/ExportCertificatios/ExportCertificatios'
import Values from './Values/Values'
import axios from 'axios'
import { BASE_URL } from '../../Axios/base_url'
import { ThreeDots } from 'react-loader-spinner'
import { base_url } from '../../consts'
const Certifications = () => {
  const {language}=UseGeneral()
  const [certPageData,setCertPageData]=useState({});
  const [pageLoading,setPageLoading]=useState(false)
  const getCertPageData=()=>{
    setPageLoading(true)
    axios.get(base_url+'pages/certification_page')
    .then((res)=>{
      console.log(res.data.result)
      if(res.data.status=='success'){
        setCertPageData(res.data.result)
      }
    })
    .catch(e=>console.log(e))
    .finally(()=>{
      setPageLoading(false)
    })
  }
  const [pages,setPages]=useState([
    {
      name:language=='ar'?'الرئيسية':'Home',
      path:'/',
    },
    {
      name:language=='ar'?'عنا':'About',
      path:'/about',
    },
    {
      name:language=='ar'?'الشهادات':'Certifications',
      path:'/certifications',
    }
  ])
  useEffect(()=>{
    getCertPageData()
  },[])
  return (
    <>
      {
        pageLoading?(
          <div style={{display:'flex',minHeight:'80vh',alignItems:'center',justifyContent:'center'}}>
            <ThreeDots color="#035297"/>
          </div>
        ):
        (
          <div className='certifications_page rowDiv'>
          <Breadcrumb links={pages}/>
          <h4>
            {
              language=='ar'?
              <>
                <span>شهادات </span>
                <span>العروبة</span>
              </>
              :
              <>
                <span>Orouba </span>
                <span>Certifications</span>
              </>
            }
          </h4>
          <div className="texts">
            <p>
              {
                language=='ar'?
                'في العروبة، نحن نفخر بالتزامنا بالجودة والتميز، وهو ما ينعكس في الشهادات والمعايير التي حصلنا عليها. لقد حصلنا على مجموعة من الشهادات التي تشهد على المعايير العالية لمنتجاتنا وعملياتنا.'
                :
                'At Orouba, we take pride in our commitment to quality and excellence, which is reflected in the certifications and standards we have achieved. We have obtained a range of certifications that attest to the high standards of our products and processes.'
              }
            </p>
            <p>
              {
                language=='ar'?
                'وتدل كل شهادة من هذه الشهادات على التزامنا بإجراءات مراقبة الجودة الصارمة، وممارسات الاستدامة البيئية، ومعايير الصحة والسلامة المهنية، والامتثال للوائح سلامة الأغذية الدولية.'
                :
                'Each of these certifications signifies our adherence to stringent quality control measures, environmental sustainability practices, occupational health and safety standards, and compliance with international food safety regulations.'
              }
            </p>
          </div>
          <ExportCertificatios certificationsData={certPageData?.certifications} showTit={false}/>
          <Values valuesData={certPageData?.values}/>
        </div>
        )
      }
    </>
  )
}

export default Certifications
