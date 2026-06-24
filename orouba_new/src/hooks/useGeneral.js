"use client";
import { useDispatch, useSelector } from "react-redux";
import { change ,change2} from "../store/languageReducer";
import { useEffect, useState } from "react";

const UseGeneral = () => {
  const language = useSelector((state) => state?.language?.language);

  const dispatch = useDispatch();
  const [data, setData] = useState();
  const changeLanguage = (payload) => {
    dispatch(change(payload));
  };
  const changLang2=(payLoad)=>{
    dispatch(change2(payLoad));
  }

  const siteData = useSelector((state) => state?.site?.siteData);

  useEffect(() => {
    if (siteData?.logo) {
      setData(siteData);
    }
  }, [siteData]);
  return {
    language: language?.toLowerCase(),
    changeLanguage: changeLanguage,
    data: data,
    changLang2:changLang2
  };
};

export default UseGeneral;
