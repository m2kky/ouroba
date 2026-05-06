import React, { useEffect, useState } from 'react'
import './Featues.css'
import { featuresData } from './data'
import Feature from './Feature/Feature'
const Featues = ({ data }) => {

  return (
    <div className='features rowDiv'>
      {
        data?.map((item, index) => {
          return (
            <Feature item={item} key={index} />
          )
        })
      }
    </div>
  )
}

export default Featues
