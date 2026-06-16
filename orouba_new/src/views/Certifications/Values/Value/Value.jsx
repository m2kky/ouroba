import React from 'react'
import UseGeneral from '../../../../hooks/useGeneral'
import RichText from '../../../../components/RichText'

const Value = ({item}) => {
  const {language}=UseGeneral()
  return (
    <div className='value'>
      <img src={item.image} alt="" />
      <RichText as="h5" html={language=='ar'? item?.titleAr : item?.titleEn} />
      <RichText as="p" html={language=='ar'? item?.descriptionAr : item?.descriptionEn} />
    </div>
  )
}

export default Value
