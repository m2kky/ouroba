import React from "react";
import Banner from './../../layouts/home/banner/index';
import Hero from "../../layouts/home/heroSection";
import Brands from './../../layouts/home/brands/index';
import WhyUs from './../../layouts/home/whyUs/index';
import Standards from "../../layouts/home/standards";
import MapSection from './../../layouts/home/mapSection/index';
import Recips from "../../layouts/home/receips";

const Home = ({ homePageData, language }) => {
  return (
    <>
      <div style={{ minHeight: "100vh" }} className="home_sections">
        <Banner data={homePageData?.banners} />
        <Hero data={homePageData?.siteinfo} language={language} />
        <Brands data={homePageData?.brands} />
        <div className="boxShadowSection">
          <WhyUs data={homePageData?.siteinfo} />
          <Standards data={homePageData?.standers} siteinfo={homePageData?.siteinfo} />
        </div>
        <MapSection data={homePageData?.siteinfo} />
        <Recips data={homePageData?.lastRecipess} withArrows={true} />
      </div>
    </>
  );
};

export default Home;
