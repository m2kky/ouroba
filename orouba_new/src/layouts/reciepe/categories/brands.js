"use client";
import React from 'react';
import UseGeneral from '../../../hooks/useGeneral';
import Breadcrumb from '../../../components/BreadCumbsLinks';
import { useRouter } from 'next/navigation';
import { localizedPath } from '@/utils/routes';

function CategoriesSlider({ data, breadCrumbsArray, brandId, currentCategoryId }) {
  const { language } = UseGeneral();
  const router = useRouter();

  const handleCategoryClick = (id) => {
    router.push(localizedPath(`/brands/${brandId}/categories/${id}?q=${id}`, language));
  };

  return (
    <div className="rowDiv" style={{ position: 'relative' }}>
      <Breadcrumb links={breadCrumbsArray} />
      <div className="brandCategoryName brandsFilter">
        {data?.map((item, index) => (
          <button
            key={index}
            className={
              currentCategoryId == item?.id
                ? "btn btn-primary brandFilter active"
                : "btn btn-primary brandFilter"
            }
            onClick={() => handleCategoryClick(item?.id)}
          >
            {language === 'ar' ? item?.nameAr : item?.nameEn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoriesSlider;
