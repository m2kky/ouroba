import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const Feature = ({ item }) => {
  const { language } = UseGeneral()
  const isArabic = language == 'ar'
  const title = isArabic ? first(item.titleAr, item.title_ar) : first(item.titleEn, item.title_en)
  const text = isArabic ? first(item.textAr, item.text_ar) : first(item.textEn, item.text_en)

  return (
    <div className='feature_item'>
      <div className="left">
        <img src={item.icon} alt="" />
      </div>
      <div className="right">
        <h5>{title}</h5>
        <p>{text}</p>
        <p></p>
      </div>
    </div>
  )
}

export default Feature
