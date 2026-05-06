import React from "react";
import "./style.css";
function Standard({ icon, title, description, backgroundInternal }) {
  return (
    <div className="standard d-flex flex-column align-items-center justify-content-cener">
      <img style={{ marginBottom: "10px" }} src={icon} alt="" />
      {backgroundInternal ? (
        <img
          className="backgroundInternal"
          style={{ marginBottom: "10px" }}
          src={require("../../assets/standards_bg.png")}
          alt=""
        />
      ) : null}
      <div className="standard_texts">
        {/* <h4>{title}</h4>  */}
        <p style={{textAlign:"center !important"}}>{description}</p>
      </div>
    </div>
  );
}

export default Standard;
