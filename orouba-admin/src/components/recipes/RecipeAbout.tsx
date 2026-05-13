"use client";

import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitize";

interface RecipeStep {
  id: string;
  stepAr: string;
  stepEn: string;
}

interface RecipeAboutProps {
  recipe: {
    internalImage: string | null;
    descriptionAr: string | null;
    descriptionEn: string | null;
    steps: RecipeStep[];
  };
  locale: "ar" | "en";
}

export default function RecipeAbout({ recipe, locale }: RecipeAboutProps) {
  const imageSrc = recipe.internalImage 
    ? (recipe.internalImage.startsWith("http") || recipe.internalImage.startsWith("/")) 
      ? recipe.internalImage 
      : `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${recipe.internalImage}`
    : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

  const description = locale === "ar" ? recipe.descriptionAr : recipe.descriptionEn;

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 flex flex-col gap-16">
      
      {/* Top Section: Image & Ingredients */}
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left: Recipe Main Image Display */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
            <Image
              src={imageSrc}
              alt="Recipe Image"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-3xl"
              unoptimized
            />
          </div>
        </div>

        {/* Right: Ingredients (Steps) */}
        <div className="w-full md:w-1/2 flex flex-col">
          {recipe.steps && recipe.steps.length > 0 && (
            <h3 className="text-3xl font-black text-orouba-blue mb-8 border-b-4 border-orouba-yellow inline-block pb-2 w-fit">
              {locale === "ar" ? "المكونات" : "Ingredients"}
            </h3>
          )}
          
          <div className="flex flex-col gap-4 text-gray-700 font-medium text-lg md:text-xl leading-relaxed">
            {recipe.steps.map((step) => {
              const stepHtml = locale === "ar" ? step.stepAr : step.stepEn;
              if (!stepHtml) return null;
              
              return (
                <div 
                  key={step.id} 
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-2 h-2 rounded-full bg-orouba-yellow mt-3 flex-shrink-0" />
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(stepHtml) }} />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Instructions */}
      {description && (
        <div className="bg-orouba-blue rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://res.cloudinary.com/duovxefh6/image/upload/v1716718777/pattern-1_kozbzs.png')] bg-repeat bg-right-top bg-[length:100%]" />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-black text-orouba-yellow mb-8 text-center md:text-start">
              {locale === "ar" ? "طريقة التحضير" : "Instructions"}
            </h3>
            <div 
              className="text-lg md:text-xl leading-loose font-medium text-white/90 max-w-5xl prose prose-invert prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          </div>
        </div>
      )}
      
    </div>
  );
}
