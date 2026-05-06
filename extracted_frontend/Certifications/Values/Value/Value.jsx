import React from 'react'
import './value.css'
import UseGeneral from '../../../../hooks/useGeneral'
const Value = ({item}) => {
  const {language}=UseGeneral()
  return (
    <div className='value'>
      <img src={item.image} alt="" />
      <h5>{language=='ar'? item?.title_ar : item?.title_en}</h5>
      <p>{language=='ar'? item?.description_ar : item?.description_en}</p>
    </div>
  )
}

export default Value
