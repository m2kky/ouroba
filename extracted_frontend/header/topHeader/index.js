import React, { useEffect, useState } from "react";
import "./style.css";
import SearchBox from "../searchBox";
import HeaderIcons from "../headerIcons";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../bottomHeader";
import { list } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import headerLeft from '../../../assets/headerLeft.png';
import headerRight from '../../../assets/headerRigh1.png';

const TopHeader = ({ data }) => {
  const navigate = useNavigate();
  const [topImage, setTopImage] = useState(null)
  const [show, setShow] = useState(false);
  const { language } = UseGeneral();

  return (
    <div className="rowDiv">
      <div className="row d-flex">
        <span className="list_toggle" onClick={() => setShow(!show)}>
          {" "}
          {list}
        </span>
        <div
          style={{ cursor: 'pointer' }}
          className="logo"
          onClick={() => navigate("/")}
        >
          <img src={require("../../../assets/logo.png")} alt="" />
        </div>
      </div>
      <BottomHeader show={show} setShow={setShow} data={data} />
      <HeaderIcons show={show} setShow={setShow} />
      <div className="imageHeader">
        <div className={`headerImage ${language == "ar" ? "active" : ""}`}>
          <img src={language == "ar"?headerLeft : headerRight}/>
          <img src={language == "ar"?headerLeft : headerRight}/>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
