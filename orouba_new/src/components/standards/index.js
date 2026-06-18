"use client";
import React from "react";
import RichText from "../RichText";
import LazyImage from "../LazyImage";
function Standard({ icon, title, description, backgroundInternal }) {
  const iconSrc = typeof icon === "string" && icon.trim() ? icon : null;
  const backgroundSrc =
    typeof backgroundInternal === "string" && backgroundInternal.trim()
      ? backgroundInternal
      : null;

  return (
    <div className="standard d-flex flex-column align-items-center justify-content-cener">
      {iconSrc ? (
        <LazyImage
          style={{ marginBottom: "10px" }}
          src={iconSrc}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : null}
      {backgroundSrc ? (
        <LazyImage
          className="backgroundInternal"
          style={{ marginBottom: "10px" }}
          src={backgroundSrc}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
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

