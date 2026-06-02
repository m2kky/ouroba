"use client";
import React from 'react';
import RecipeBanner from './RecipeBanner/RecipeBanner';
import UseGeneral from '../../hooks/useGeneral';
import Featues from './Featues/Featues';
import RecipeAbout from './RecipeAbout/RecipeAbout';

const RecipeDetails = ({ data, breads }) => {
  const { language } = UseGeneral();

  return (
    <div className="recipe_details">
      <RecipeBanner data={data} breads={breads} />
      {data?.properties && data?.properties?.length ? (
        <Featues data={data?.properties} />
      ) : null}
      <RecipeAbout data={data} />
    </div>
  );
};

export default RecipeDetails;
