import React from "react";
import Header from "../header";
import Footer from "../footer";
import "./style.css"
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
