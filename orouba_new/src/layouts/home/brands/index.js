"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import SectionTitle from '../../../components/sectionTitle';
import ContentLoader from 'react-content-loader';
import UseGeneral from '../../../hooks/useGeneral';
import { localizedPath } from '@/utils/routes';
import LazyImage from '../../../components/LazyImage';
import { localizedText, splitHeading } from '@/utils/siteText';

const optimizedImageSrc = (src) => src;

function Brands({ data, siteinfo }) {
  const router = useRouter();
  const { language } = UseGeneral();
  const title = localizedText(
    siteinfo,
    language,
    ["home_brands_title"],
    language === "ar" ? "منتجاتنا" : "Our Brands"
  );
  const titleParts = splitHeading(title);
  const firstTitlePart = titleParts.rest ? titleParts.first.trim() : "";
  const secondTitlePart = titleParts.rest || titleParts.first;

  return (
    <div className="hero_section d-flex justify-content-between flex-column w-full rowDiv">
      <SectionTitle
        minColorWord={firstTitlePart}
        minColorWordAr={firstTitlePart}
        secondColorWord={secondTitlePart}
        secondColorWordAr={secondTitlePart}
        ru={true}
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
