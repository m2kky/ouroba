import React, { useEffect } from 'react';
import './style.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContentLoader from 'react-content-loader';
import UseGeneral from '../../../hooks/useGeneral';
import { FreeMode, Navigation } from 'swiper/modules';
import { arrowLeft } from '../../../assets/svgIcons';
import Breadcrumb from '../../../components/BreadCumbsLinks';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

function CategoriesSlider({ data, breadCrumbsArray }) {
  const { language } = UseGeneral();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const { brandId, brandName, brandCategoryName,id } = useParams();
  useEffect(() => {
    if (!params.get('q') && data && data?.length) {
      const newParams = new URLSearchParams(params.toString());
      newParams.set('q', data && data[0]?.id?.toString());
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [data]);

  const handleCategoryClick = (id, categoryName) => {
    // console.log(id)
    // return
    const newParams = new URLSearchParams(params.toString());
    newParams.set('q', id);
    navigate(
      `/Brands/${brandName}/${brandId}/${id}/${categoryName}?${newParams.toString()}`,
      { replace: true }
    );
  };

  return (
    <div className="rowDiv" style={{ position: 'relative' }}>
      <Breadcrumb links={breadCrumbsArray} />
      <div className="brandCategoryName brandsFilter">
        {data?.map((item, index) => (
          <button
            key={index}
            className={
              id == item?.id
                ? "btn btn-primary brandFilter active"
                : "btn btn-primary brandFilter"
            }
            onClick={() =>
              handleCategoryClick(
                item?.id,
                language == "ar" ? item?.name_ar : item?.name_en
              )
            }
          >
            {language === 'ar' ? item?.name_ar : item?.name_en}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoriesSlider;
