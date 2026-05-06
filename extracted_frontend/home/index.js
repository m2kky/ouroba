import React, { useEffect, useState } from "react";
import Banner from './../../layouts/home/banner/index';
import Hero from "../../layouts/home/heroSection";
import Brands from './../../layouts/home/brands/index';
import WhyUs from './../../layouts/home/whyUs/index';
import "./style.css";
import Standards from "../../layouts/home/standards";
import MapSection from './../../layouts/home/mapSection/index';
import Recips from "../../layouts/home/receips";
import { toast } from 'react-hot-toast';
import { base_url } from "../../consts";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
const Home = () => {
  const [homePageData, setHomePageData] = useState(null);
  const [pageLoading,setPageLoading]=useState(false)
  const getHomePageData = async () => {
    setPageLoading(true)
    try {
      const homePageData = await axios.get(base_url + "pages/get_home_page")
      .finally(()=>{
        setPageLoading(false)
      })
      .catch(e=>console.log(e))
      setHomePageData(homePageData?.data?.result);
    } catch (err) {
      setHomePageData({});
      toast.error("Error Get Data");
    }
  };
  useEffect(() => {
    getHomePageData();
  }, []);
  return (
    <>
      {!homePageData ? null : null}{" "}
      {
        pageLoading?(
          <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <ThreeDots color="#035297"/>
          </div>
        )
        :
        (
          <>
            <div style={{ minHeight: "100vh" }} className="home_sections">
              <Banner data={homePageData?.banners} />
              <Hero data={homePageData?.siteinfo}/>
              <Brands data={homePageData?.brands} />
              <div className="boxShadowSection">
                <WhyUs data={homePageData?.siteinfo} />
                <Standards data={homePageData?.standers} />
              </div>
              <MapSection data={homePageData?.siteinfo}/>
              <Recips data={homePageData?.lastRecipess} withArrows={true}/>
            </div>
          </>
        )
      }
    </>
  );
};

export default Home;
