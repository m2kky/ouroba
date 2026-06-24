"use client";
import React from 'react'
import UseGeneral from '../../hooks/useGeneral'
import Breadcrumb from '../../components/BreadCumbsLinks'
import ExportCertificatios from '../Export/ExportCertificatios/ExportCertificatios'
import Values from './Values/Values'
import RichText from '../../components/RichText'
import { splitHeading } from '../../utils/siteText'

const localizedSetting = (settings, key, language) => {
  const value =
    language === "ar"
      ? settings?.[`${key}Ar`] || settings?.[key]
      : settings?.[`${key}En`] || settings?.[key];

  return typeof value === "string" ? value : "";
};

const Certifications = ({ certPageData }) => {
  const {language}=UseGeneral()
  const siteinfo = certPageData?.siteinfo || {};
  const introText =
    localizedSetting(siteinfo, "certificationText", language) ||
    localizedSetting(siteinfo, "certification_text", language) ||
    (language=='ar'
      ? 'في العروبة، نحن نفخر بالتزامنا بالجودة والتميز، وهو ما ينعكس في الشهادات والمعايير التي حصلنا عليها. لقد حصلنا على مجموعة من الشهادات التي تشهد على المعايير العالية لمنتجاتنا وعملياتنا.'
      : 'At Orouba, we take pride in our commitment to quality and excellence, which is reflected in the certifications and standards we have achieved. We have obtained a range of certifications that attest to the high standards of our products and processes.');
  const detailsText =
    localizedSetting(siteinfo, "certificationDetails", language) ||
    (language=='ar'
      ? 'وتدل كل شهادة من هذه الشهادات على التزامنا بإجراءات مراقبة الجودة الصارمة، وممارسات الاستدامة البيئية، ومعايير الصحة والسلامة المهنية، والامتثال للوائح سلامة الأغذية الدولية.'
      : 'Each of these certifications signifies our adherence to stringent quality control measures, environmental sustainability practices, occupational health and safety standards, and compliance with international food safety regulations.');
  const valuesIntro =
    localizedSetting(siteinfo, "values_text", language) ||
    (language == "ar"
      ? 'في العروبة، قيمنا هى أساس لكل ما نقوم به. فهي توجهنا في اتخاذ قراراتنا، وإجراءاتنا وتفاعلاتنا مع عملائنا، كما تعكس التزامنا بالنزاهة والتميز والمسؤولية الاجتماعية.'
      : 'At Orouba, our values serve as the foundation of everything we do. They guide our decisions, actions, and interactions with our stakeholders, and reflect our commitment to integrity, excellence, and social responsibility.');
  const certificationsTitle =
    localizedSetting(siteinfo, "certifications_title", language) ||
    (language == "ar" ? "شهادات العروبة" : "Orouba Certifications");
  const certificationsTitleParts = splitHeading(certificationsTitle);
  const valuesTitle =
    localizedSetting(siteinfo, "values_title", language) ||
    (language == "ar" ? "قيمنا" : "Our Values");
  
  const pages = [
    {
      name:language=='ar'?'الرئيسية':'Home',
      route:'/',
    },
    {
      name:language=='ar'?'عنا':'About',
      route:'/about',
    },
    {
      name:language=='ar'?'الشهادات':'Certifications',
      active: true,
    }
  ];

  return (
    <>
      <div className='certifications_page rowDiv' style={{ minHeight: "100vh" }}>
      <Breadcrumb links={pages}/>
      <h4>
        {certificationsTitleParts.first}
        {certificationsTitleParts.rest ? <span>{certificationsTitleParts.rest}</span> : null}
      </h4>
      <div className="texts">
        <RichText as="p" html={introText} />
        <RichText as="p" html={detailsText} />
      </div>
      <ExportCertificatios certificationsData={certPageData?.certifications} showTit={false}/>
      <Values valuesData={certPageData?.values} introText={valuesIntro} title={valuesTitle}/>
    </div>
    </>
  )
}

export default Certifications
