import React, { useEffect, useState } from "react";
import "./style.css";
import TopHeader from "../../components/header/topHeader";
import { base_url } from "../../consts";
import axios from "axios";
import toast from "react-hot-toast";

const Header = ({ whats, phone }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const homePageData = await axios.get(base_url + "brands/get_for_user");
      setData(homePageData?.data?.result);
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
