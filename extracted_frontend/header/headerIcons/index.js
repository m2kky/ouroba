import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { language, list, search } from "../../../assets/svgIcons";
import UseGeneral from './../../../hooks/useGeneral';
import "./style.css";
import { useDispatch } from "react-redux";
import SearchBox from "../searchBox";
import { FaGlobe } from "react-icons/fa6";
import languageImg from '../../../assets/Language.png';

const HeaderIcons = ({ setShow, show }) => {
  const {language} = UseGeneral();
  const navigate = useNavigate();
  const [top, setTop] = useState(0);

  useEffect(() => {
    console.log(language);
    setTop(document.querySelector("header")?.clientHeight);
  }, []);
  const { changeLanguage, language: xLanguage } = UseGeneral();
  const dispatch = useDispatch();
  const [showSearch, setShowSearh] = useState(false);
  return (
    <div className="HeaderIcons">
      <button className="hoverable" onClick={() => navigate("/ExportCatalog")}>
        {xLanguage == "ar" ? "تحميل الكتالوج" : "Export Catalogue"}
      </button>
      <div className="menuToggle">
        <div className="menuLabel" style={{ margin: 0 }}>
        {/* <FaGlobe /> */}
          {/* <Link to="#">{language}</Link> */}
          <img src={languageImg}/>
          <ul
            className={`menu`}
            style={{ top: "230%", translate: "-50% -36%" }}
            href="/"
          >
            <li className={language == "ar"}>
              <a href="#" onClick={() => (changeLanguage("ar"))}>العربية</a>
              <a href="#" onClick={() => changeLanguage("en")}>English</a>
            </li>
          </ul>
        </div>
      </div>

      <span role="button" onClick={() => setShowSearh(true)}>
        {search}
      </span>
      {showSearch ? <SearchBox setShowSearchModal={setShowSearh} /> : null}
    </div>
  );
};

export default HeaderIcons;
