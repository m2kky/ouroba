"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

interface RecipeBannerProps {
  recipe: any;
  locale: "ar" | "en";
}

export default function RecipeBanner({ recipe, locale }: RecipeBannerProps) {
  const recipeName = locale === "ar" ? recipe.nameAr : recipe.nameEn;
  const imageSrc = recipe.internalImage 
    ? (recipe.internalImage.startsWith("http") || recipe.internalImage.startsWith("/")) 
      ? recipe.internalImage 
      : `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${recipe.internalImage}`
    : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[80vh] flex flex-col justify-end pb-16 overflow-hidden rounded-b-[3rem]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={recipeName}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Breadcrumbs */}
      <div className="absolute top-24 md:top-32 left-0 right-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-sm md:text-base text-white/80">
            <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">
              {locale === "ar" ? "الصفحة الرئيسية" : "Home"}
            </Link>
            <ChevronLeft className="w-4 h-4 mt-1" />
            <Link href={`/${locale}/recipes`} className="hover:text-orouba-yellow transition-colors">
              {locale === "ar" ? "الوصفات" : "Recipes"}
            </Link>
            <ChevronLeft className="w-4 h-4 mt-1" />
            <span className="text-orouba-yellow drop-shadow-md">{recipeName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mt-40 md:mt-0">
        
        {/* Title */}
        <motion.div 
          className="text-white text-center md:text-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black drop-shadow-xl leading-tight">
            {recipeName}
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
