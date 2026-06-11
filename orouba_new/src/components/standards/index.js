"use client";
import React from "react";
import RichText from "../RichText";
function Standard({ icon, title, description, backgroundInternal }) {
  const iconSrc = typeof icon === "string" && icon.trim() ? icon : null;
  const backgroundSrc =
    typeof backgroundInternal === "string" && backgroundInternal.trim()
      ? backgroundInternal
      : null;

  return (
    <div className="standard d-flex flex-column align-items-center justify-content-cener">
      {iconSrc ? <img style={{ marginBottom: "10px" }} src={iconSrc} alt="" /> : null}
      {backgroundSrc ? (
        <img
          className="backgroundInternal"
          style={{ marginBottom: "10px" }}
          src={backgroundSrc}
          alt=""
        />
      ) : null}
      <div className="standard_texts">
        {/* <h4>{title}</h4>  */}
        <RichText as="p" html={description} style={{ textAlign: "center" }} />
      </div>
    </div>
  );
}

export default Standard;

