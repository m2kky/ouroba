"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

interface CategoriesSliderProps {
  categories: Category[];
  brandId: string;
  activeCategoryId: string;
  locale: "ar" | "en";
  brandColor?: string | null;
}

export default function CategoriesSlider({
  categories,
  brandId,
  activeCategoryId,
  locale,
  brandColor,
}: CategoriesSliderProps) {
  const defaultColor = brandColor || "#005097"; // Fallback to Farida blue

  return (
    <div className="w-full flex justify-center px-4 my-8 relative z-20">
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl">
        {categories.map((cat, index) => {
          const isActive = cat.id === activeCategoryId;
          const catName = locale === "ar" ? cat.nameAr : cat.nameEn;

          return (
            <Link key={cat.id} href={`/brands/${brandId}/${cat.id}`}>
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`px-6 py-2 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-sm border-2`}
                style={{
                  backgroundColor: isActive ? defaultColor : "#fff",
                  color: isActive ? "#fff" : "#666",
                  borderColor: isActive ? defaultColor : "#eee",
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: defaultColor,
                  color: isActive ? "#fff" : defaultColor,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {catName}
              </motion.button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
