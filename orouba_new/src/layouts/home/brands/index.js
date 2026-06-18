"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '../../../components/sectionTitle';
import ContentLoader from 'react-content-loader';
import UseGeneral from '../../../hooks/useGeneral';
import { localizedPath } from '@/utils/routes';
import LazyImage from '../../../components/LazyImage';

const optimizedImageSrc = (src, width = 640) => {
  if (!src || !/^https?:\/\//i.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=70`;
};

function Brands({ data }) {
  const router = useRouter();
  const { language } = UseGeneral();

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
          data?.map((item, index) => (
            <LazyImage
              key={item?.id ?? index}
              src={optimizedImageSrc(item?.image)}
              onClick={() => router.push(localizedPath("/brands/" + item?.id, language))}
              className="brandImage"
              alt={`Brand ${item?.id}`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              rootMargin="0px 0px -160px 0px"
              threshold={0.2}
            />
          ))
        ) : null}
      </div>
    </div>
  );
}

export default Brands;
