"use client";

import Image from "next/image";

interface RecipeProperty {
  id: string;
  icon: string | null;
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
}

interface RecipeFeaturesProps {
  properties: RecipeProperty[];
  locale: "ar" | "en";
}

export default function RecipeFeatures({ properties, locale }: RecipeFeaturesProps) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="w-full flex justify-center -mt-10 relative z-30 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-wrap items-center justify-center gap-8 md:gap-16 max-w-4xl w-full">
        {properties.map((prop) => (
          <div key={prop.id} className="flex flex-col items-center gap-3">
            {prop.icon && (
              <div className="w-12 h-12 relative opacity-80">
                <Image
                  src={(prop.icon.startsWith("http") || prop.icon.startsWith("/")) ? prop.icon : `https://camp-coding.site/eloroba/${prop.icon}`}
                  alt={locale === "ar" ? prop.titleAr : prop.titleEn}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className="text-center">
              <h4 className="text-gray-400 text-sm font-bold mb-1">
                {locale === "ar" ? prop.titleAr : prop.titleEn}
              </h4>
              <p className="text-orouba-blue font-black text-lg">
                {locale === "ar" ? prop.textAr : prop.textEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
