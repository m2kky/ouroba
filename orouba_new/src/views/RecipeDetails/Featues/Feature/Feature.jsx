import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const Feature = ({ item }) => {
  const { language } = UseGeneral()
  const isArabic = language == 'ar'
  const title = isArabic ? first(item.titleAr, item.title_ar) : first(item.titleEn, item.title_en)
  const text = isArabic
    ? first(item.textAr, item.text_ar, item.value_ar)
    : first(item.textEn, item.text_en, item.value_en)
  const icon = React.isValidElement(item.icon)
    ? item.icon
    : item.icon
      ? <img src={item.icon} alt="" />
      : null

  return (
    <div className='feature_item'>
      <div className="left">
        {icon}
      </div>
      <div className="right">
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default Feature
