import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'

const Feature = ({ item }) => {
  const { language } = UseGeneral()
  return (
    <div className='feature_item'>
      <div className="left">
        <img src={item.icon} alt="" />
      </div>
      <div className="right">
        <h5>{language == 'ar' ? item.titleAr : item.titleEn}</h5>
        <p>{language == 'ar' ? item.textAr : item.textEn}</p>
        <p></p>
      </div>
    </div>
  )
}

export default Feature
