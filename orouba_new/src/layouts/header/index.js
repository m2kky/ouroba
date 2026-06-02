"use client";
import React, { useEffect, useState } from "react";
import TopHeader from "../../components/header/topHeader";
import {  base_url  } from '@/consts';
import axios from "axios";
import toast from "react-hot-toast";
import { resolveMediaTree } from "@/utils/media";

const Header = () => {
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


  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const homePageData = await axios.get(base_url + "brands/get_for_user");
      setData(resolveMediaTree(homePageData?.data?.result));
    } catch (err) {
      setData({});
      toast.error("Error Get Data");
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <header className={`header ${isSticky ? "sticky" : ""}`}>
      <div className="headerBackground">
        <TopHeader data={data}/>
      </div>
    </header>
  );
};

export default Header;
