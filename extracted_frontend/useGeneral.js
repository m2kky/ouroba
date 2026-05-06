import { useDispatch, useSelector } from "react-redux";
import { change ,change2} from "../store/languageReducer";
import { useEffect, useState } from "react";
import { Axios } from "../Axios";
import { BASE_URL } from "../Axios/base_url";
import { fetchSiteData } from "../store/siteReducer";

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
    if (language.toLowerCase() == "ar") {
      document.body.classList.add("arVersion");
      document.body.classList.remove("enVersion");
    } else {
      document.body.classList.add("enVersion");
      document.body.classList.remove("arVersion");
    }
  }, [language]);
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
