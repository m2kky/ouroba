import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../../components/sectionTitle';
import ContentLoader from 'react-content-loader';
import './style.css';

function Brands({ data }) {
  const navigate = useNavigate();

  return (
    <div className="hero_section d-flex justify-content-between flex-column w-full rowDiv">
      <SectionTitle
        minColorWord={"Our"}
        minColorWordAr={""}
        secondColorWord={"Brands"}
        secondColorWordAr={"منتجاتنا"}
        classessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
        headerClassessName={[
          "justify-content-center",
          "align-item-center",
          "text-center",
        ]}
      />
      <div className="brandsImages brandsImagesMainPages">
        {!data ? (
          <ContentLoader />
        ) : data?.length ? (
          data?.map((item) => (
            <img
              src={item?.image}
              onClick={() => navigate("/brands/" + item?.id)}
              className="brandImage"
              alt={`Brand ${item?.id}`}
            />
          ))
        ) : null}
      </div>
    </div>
  );
}

export default Brands;
