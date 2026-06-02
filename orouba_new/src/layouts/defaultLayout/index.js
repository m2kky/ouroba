"use client";
import React from "react";
import Header from "../header";
import Footer from "../footer";
const DefaultLayout = ({ classessName, children, whats, phone }) => {
  return (
    <div
      className={
        !classessName || !classessName?.length
          ? "defaultLayout"
          : "defaultLayout" + " " + classessName?.join()
      }
    >
      <Header whats={whats} phone={phone} />
      {children}
      <Footer />
    </div>
  );
};

export default DefaultLayout;

