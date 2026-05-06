import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'
import './Feature.css'
const Feature = ({ item }) => {
  const { language } = UseGeneral()
  return (
    <div className='feature_item'>
      <div className="left">
        <img src={item.icon} alt="" />
      </div>
      <div className="right">
        <h5>{language == 'ar' ? item.title_ar : item.title_en}</h5>
        <p>{language == 'ar' ? item.text_ar : item.text_en}</p>
        <p></p>
      </div>
      {/* <div className="top">
        <img src={item.image} alt="" />
        <h5>{language=='ar'?item.title_ar:item.title_en}</h5>
      </div>
      <div className="bottom">
        {language=='ar'?item.value_ar:item.value_en}
      </div> */}
    </div>
  )
}

export default Feature
