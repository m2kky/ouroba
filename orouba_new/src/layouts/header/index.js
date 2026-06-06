"use client";
import React, { useEffect, useState } from "react";
import TopHeader from "../../components/header/topHeader";

const Header = ({ brands = [], siteinfo = {} }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    (typeof window !== 'undefined' ? window : {addEventListener: ()=>{}}).addEventListener("scroll", handleScroll);

    return () => {
      (typeof window !== 'undefined' ? window : {removeEventListener: ()=>{}}).removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <header className={`header ${isSticky ? "sticky" : ""}`}>
      <div className="headerBackground">
        <TopHeader data={brands} siteinfo={siteinfo}/>
      </div>
    </header>
  );
};

export default Header;
