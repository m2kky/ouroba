import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'

const Value = ({item}) => {
  const {language}=UseGeneral()
  return (
    <div className='value'>
      <img src={item.image} alt="" />
      <h5>{language=='ar'? item?.titleAr : item?.titleEn}</h5>
      <p>{language=='ar'? item?.descriptionAr : item?.descriptionEn}</p>
    </div>
  )
}

export default Value
