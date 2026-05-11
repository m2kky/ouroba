"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface RecipeCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  image?: string | null;
}

interface RecipesCategoriesSliderProps {
  categories: RecipeCategory[];
  activeCategoryId: string;
  locale: "ar" | "en";
}

export default function RecipesCategoriesSlider({
  categories,
  activeCategoryId,
  locale,
}: RecipesCategoriesSliderProps) {
  const mainColor = "#005097"; // Orouba Blue

  return (
    <div className="w-full flex justify-center px-4 my-10 relative z-20 overflow-hidden">
      <div className="flex overflow-x-auto gap-4 md:gap-8 pb-6 px-4 snap-x snap-mandatory hide-scrollbar max-w-7xl">
        {categories.map((cat, index) => {
          const isActive = cat.id === activeCategoryId;
          const catName = locale === "ar" ? cat.nameAr : cat.nameEn;
          const displayImage = cat.image 
            ? (cat.image.startsWith("http") ? cat.image : `https://camp-coding.site/eloroba/${cat.image}`)
            : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

          return (
            <Link key={cat.id} href={`/recipes/ar?c=${cat.id}`} className="snap-center shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex flex-col items-center gap-3 transition-all duration-300 w-24 md:w-32 group`}
                whileHover={{ y: -5 }}
              >
                {/* Image Circle */}
                <div 
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center p-3 transition-all duration-300 shadow-md border-[3px]`}
                  style={{
                    backgroundColor: isActive ? "#f8f9fa" : "#fff",
                    borderColor: isActive ? mainColor : "transparent",
                  }}
                >
                  <img 
                    src={displayImage} 
                    alt={catName} 
                    className={`w-full h-full object-contain transition-transform duration-300 ${!cat.image ? 'opacity-30 grayscale' : 'group-hover:scale-110'}`} 
                  />
                </div>
                
                {/* Category Name */}
                <span 
                  className={`font-bold text-center text-sm md:text-base leading-tight transition-colors duration-300`}
                  style={{ color: isActive ? mainColor : "#4b5563" }}
                >
                  {catName}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
