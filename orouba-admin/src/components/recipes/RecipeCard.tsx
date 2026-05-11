"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface Recipe {
  id: string;
  nameAr: string | null;
  nameEn: string | null;
  internalImage: string | null;
  videoLink: string | null;
}

interface RecipeCardProps {
  recipe: Recipe;
  locale: "ar" | "en";
}

export default function RecipeCard({ recipe, locale }: RecipeCardProps) {
  const recipeName = locale === "ar" ? recipe.nameAr : recipe.nameEn;
  const imageSrc = recipe.internalImage?.startsWith("http") 
    ? recipe.internalImage 
    : recipe.internalImage 
      ? `https://camp-coding.site/eloroba/${recipe.internalImage}`
      : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

  return (
    <Link href={`/recipes/details/${recipe.id}/${locale}`}>
      <motion.div
        className="relative group bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer w-full h-[280px]"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5 }}
      >
        {/* Recipe Image as Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={recipeName || "Recipe"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* Play Icon if there's a video */}
        {recipe.videoLink && (
          <div className="absolute top-4 right-4 z-20 bg-orouba-yellow w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            <Play className="w-4 h-4 text-white fill-white ml-1" />
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <h4 className="text-white font-bold text-lg md:text-xl line-clamp-2 drop-shadow-md group-hover:text-orouba-yellow transition-colors duration-300">
            {recipeName}
          </h4>
        </div>
      </motion.div>
    </Link>
  );
}
