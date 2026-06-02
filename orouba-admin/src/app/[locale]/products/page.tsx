/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { getImageUrl } from "@/lib/api-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const isEn = resolvedParams.locale === "en";
  return {
    title: isEn ? "Product Types - Orouba" : "أصناف المنتجات - العروبة",
    description: isEn ? "Explore Orouba's variety of frozen products." : "اكتشف تشكيلة منتجات العروبة المجمدة.",
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const isEn = locale === "en";

  // Fetch Category Types
  const types = await prisma.categoryType.findMany({
    where: { isHidden: false },
    orderBy: { number: "asc" },
    include: {
      categories: {
        include: {
          category: {
            include: { brand: true },
          },
        },
        orderBy: { number: "asc" },
      },
    },
  });

  // Fetch Settings for Banner Text & Image
  const siteSettings = await prisma.siteSetting.findMany();
  const settings: Record<string, { en?: string; ar?: string }> = {};
  siteSettings.forEach((setting: any) => {
    settings[setting.key] = { en: setting.valueEn || "", ar: setting.valueAr || "" };
  });

  const getSetting = (key: string) => {
    const s = settings[key];
    if (!s) return "";
    return isEn ? s.en || s.ar : s.ar || s.en;
  };

  const bannerImage = getSetting("product_type_img") || "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.webp";
  const bannerText = getSetting("product_type_text") || (isEn 
    ? "Explore our large variety of fresh, naturally processed, and quick-frozen products ensuring the highest quality."
    : "اكتشف تشكيلتنا الكبيرة من المنتجات الطازجة، المعالجة طبيعياً والمجمدة بسرعة لضمان أعلى جودة.");

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(bannerImage)} 
            alt="Products Banner" 
            className="w-full h-full object-cover filter brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <FadeIn direction="up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              {isEn ? "Product Types" : "أصناف المنتجات"}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-md">
              {bannerText}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <nav className="flex text-gray-500 font-medium text-sm md:text-base">
          <ol className={`flex items-center space-x-2 ${isEn ? "" : "space-x-reverse"}`}>
            <li>
              <Link href={`/${locale}`} className="hover:text-orouba-blue transition-colors">
                {isEn ? "Home" : "الصفحة الرئيسية"}
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link href={`/${locale}/about/whoWeAre`} className="hover:text-orouba-blue transition-colors">
                {isEn ? "About Us" : "عن العروبة"}
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-orouba-blue font-bold" aria-current="page">
              {isEn ? "Product Types" : "أصناف المنتجات"}
            </li>
          </ol>
        </nav>
      </div>

      {/* 3. Products Types List */}
      <section className="py-10 max-w-[1400px] mx-auto px-4 md:px-8 pb-20 space-y-20">
        {types.map((type: any, index: number) => {
          const isEven = index % 2 === 0;
          const flexDirection = isEven 
            ? (isEn ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse")
            : (isEn ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row");

          return (
            <FadeIn key={type.id} direction={isEven ? "left" : "right"} delay={0.1}>
              <div className={`flex ${flexDirection} gap-10 md:gap-16 items-center bg-white rounded-[3rem] p-6 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100`}>
                
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative group">
                  <div className="rounded-[2.5rem] overflow-hidden shadow-lg relative aspect-square md:aspect-[4/3]">
                    <img 
                      src={getImageUrl(type.image)} 
                      alt={isEn ? type.titleEn : type.titleAr}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 space-y-6 ${isEn ? "text-left" : "text-right"}`}>
                  <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-4 leading-tight">
                    {isEn ? type.titleEn : type.titleAr}
                  </h2>
                  <div className="w-20 h-1.5 bg-orouba-yellow rounded-full mb-6"></div>
                  
                  <p className="text-xl text-gray-600 leading-relaxed font-medium">
                    {isEn ? type.descriptionEn : type.descriptionAr}
                  </p>

                  {/* Brand Logos Mapping to their categories */}
                  {type.categories && type.categories.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-4 pt-6 ${isEn ? "justify-start" : "justify-start flex-row-reverse"}`}>
                      {type.categories.map((catType: any) => {
                        const brand = catType.category?.brand;
                        if (!brand) return null;
                        const brandSlug = (brand.nameEn || brand.nameAr || "brand").replace(/\s+/g, '-');
                        
                        return (
                          <Link 
                            key={catType.id}
                            href={`/${locale}/brands/${brandSlug}/${brand.id}?category=${catType.category.id}`}
                            className="bg-gray-50 border border-gray-100 p-3 rounded-2xl hover:shadow-lg hover:border-orouba-yellow transition-all duration-300 transform hover:-translate-y-1"
                            title={isEn ? catType.category.nameEn : catType.category.nameAr}
                          >
                            <img 
                              src={getImageUrl(catType.image || catType.category.image)} 
                              alt={isEn ? catType.category.nameEn : catType.category.nameAr}
                              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </FadeIn>
          );
        })}
      </section>

    </div>
  );
}
