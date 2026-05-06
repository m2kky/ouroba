import React, { useEffect, useState } from 'react';
import './RecipeDetails.css';
import RecipeBanner from './RecipeBanner/RecipeBanner';
import UseGeneral from '../../hooks/useGeneral';
import Featues from './Featues/Featues';
import RecipeAbout from './RecipeAbout/RecipeAbout';
import { base_url } from '../../consts';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
const RecipeDetails = () => {
  const { language } = UseGeneral();
  const [params] = useSearchParams();
  console.log(params)
  const { recName, recId, foodName, foodId,id } = useParams();
  // console.log(foodId,"foodIdfoodId")
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const homePageData = await axios.get(
        base_url + "cooks/cook_details/" + id
      );
      console.log(homePageData?.data?.result);
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
    <div className="recipe_details">
      <RecipeBanner data={data} breads={{...{ recName, recId, foodName, foodId }}}/>
      {data?.props && data?.props?.length ? (
        <Featues data={data?.props} />
      ) : null}
      <RecipeAbout data={data} />
    </div>
  );
};

export default RecipeDetails;
