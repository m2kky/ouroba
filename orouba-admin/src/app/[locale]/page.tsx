import Link from "next/link";
import { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import HeroCarousel from "@/components/ui/HeroCarousel";
import RecipeCarousel from "@/components/ui/RecipeCarousel";
import { getImageUrl, getSiteData } from "@/lib/api-client";
import { localize, localizedSetting, type Locale } from "@/lib/site-content";

type HomeBannerInput = {
  id: string;
  type?: string | null;
  image?: string | null;
  imageEn?: string | null;
  videoLink?: string | null;
  videoLinkEn?: string | null;
  smallImg?: string | null;
  smallImgEn?: string | null;
  smallVideo?: string | null;
  smallVideoEn?: string | null;
  [key: string]: unknown;
};

const isKnownMissingHeroMedia = (url: string) => {
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.endsWith("/products/1.mp4") ||
    lowerUrl.endsWith("/products/banner-2.png") ||
    lowerUrl.includes("/storage/app/images/1.mp4") ||
    lowerUrl.includes("/storage/app/images/banner-2.png")
  );
};

const firstUsableMedia = (...urls: Array<string | null | undefined>) => {
  for (const url of urls) {
    const normalized = getImageUrl(url);
    if (normalized && !isKnownMissingHeroMedia(normalized)) return normalized;
  }
  return "";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Orouba Foods" : "العروبة للصناعات الغذائية",
    description: isEn
      ? "Premium frozen vegetables, fruits, beans, falafel, and pre-fried products from Orouba Foods."
      : "منتجات العروبة المجمدة من الخضروات والفواكه والبقوليات والفلافل والمنتجات النصف مقلية.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === "en" ? "en" : "ar";
  const isEn = locale === "en";
  const data = await getSiteData();
  const settings = data?.settings || {};

  const banners = ((data?.banners || []) as HomeBannerInput[])
    .map((banner) => {
      const image = firstUsableMedia(isEn ? banner.imageEn : banner.image, banner.image, banner.imageEn);
      const videoLink = firstUsableMedia(isEn ? banner.videoLinkEn : banner.videoLink, banner.videoLink, banner.videoLinkEn);
      const smallImg = firstUsableMedia(isEn ? banner.smallImgEn : banner.smallImg, banner.smallImg, banner.smallImgEn, image);
      const smallVideo = firstUsableMedia(isEn ? banner.smallVideoEn : banner.smallVideo, banner.smallVideo, banner.smallVideoEn, videoLink);
      const type = banner.type === "video" && videoLink ? "video" : image ? "image" : banner.type;

      return {
        ...banner,
        type,
        image,
        imageEn: image,
        videoLink,
        videoLinkEn: videoLink,
        smallImg,
        smallImgEn: smallImg,
        smallVideo,
        smallVideoEn: smallVideo,
      };
    })
    .filter((banner) => banner.type === "video" ? banner.videoLink : banner.image);
  banners.sort((a, b) => {
    if (a.type === b.type) return Number(a.number || 999) - Number(b.number || 999);
    return a.type === "image" ? -1 : 1;
  });

  const visionImage = localizedSetting(
    settings,
    locale,
    ["home_vision_image", "vision_image", "hero_img"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.webp"
  );
  const visionText = localizedSetting(
    settings,
    locale,
    ["home_vision_text", "vision"],
    isEn
      ? "Orouba for Food Industry Co. was founded in 1998 with a vision to produce premium quality frozen food products."
      : "تأسست شركة العروبة لصناعة المواد الغذائية سنة 1998 برؤية تهدف لإنتاج وابتكار منتجات غذائية مجمدة عالية الجودة."
  );
  const visionTitle = localizedSetting(settings, locale, ["home_vision_title"], isEn ? "From Vision to Reality" : "من الرؤية إلى الواقع");
  const whyImage = localizedSetting(
    settings,
    locale,
    ["home_why_image", "why_orouba_img", "why_choose_img"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.webp"
  );
  const whyText = localizedSetting(
    settings,
    locale,
    ["home_why_text", "why_orouba"],
    isEn
      ? "Choosing Orouba means opting for quality, convenience, and a touch of culinary delight."
      : "اختيار العروبة هو اختيار الجودة والسهولة ومتعة الطهي."
  );
  const whyTitle = localizedSetting(settings, locale, ["home_why_title"], isEn ? "Why Orouba?" : "لماذا العروبة؟");
  const standardsText = localizedSetting(
    settings,
    locale,
    ["home_standards_text", "stander"],
    isEn
      ? "At Orouba, we hold ourselves to the highest standards to ensure every product meets and exceeds your expectations."
      : "نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك."
  );
  const standardsTitle = localizedSetting(settings, locale, ["home_standards_title"], isEn ? "Our Standards" : "معاييرنا");
  const worldMapImage = localizedSetting(
    settings,
    locale,
    ["home_world_image", "map"],
    "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.webp"
  );
  const worldText = localizedSetting(
    settings,
    locale,
    ["home_world_text", "world_text", "export_world"],
    isEn
      ? "Our extensive network guarantees timely delivery to over 50 countries worldwide."
      : "تضمن شبكتنا الواسعة إيصال منتجاتنا طوال العام لأكثر من 50 دولة حول العالم."
  );
  const worldTitle = localizedSetting(settings, locale, ["home_world_title"], isEn ? "Orouba World Map" : "العروبة حول العالم");

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <HeroCarousel banners={banners} isEn={isEn} />

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isEn ? "" : "lg:[direction:ltr]"}`}>
          <FadeIn direction={isEn ? "right" : "left"} className="relative">
            <img
              src={getImageUrl(visionImage)}
              alt={isEn ? "Orouba vision" : "رؤية العروبة"}
              className="w-full max-h-[520px] object-contain"
            />
          </FadeIn>

          <FadeIn direction={isEn ? "left" : "right"} className={`${isEn ? "text-left" : "text-right lg:[direction:rtl]"}`}>
            <h1 className="text-4xl md:text-6xl font-black text-orouba-blue leading-tight mb-8">
              {visionTitle}
            </h1>
            <p className="text-lg md:text-xl text-[#035297] leading-loose whitespace-pre-line font-medium">
              {visionText}
            </p>
            <Link
              href={`/${locale}/about/whoWeAre`}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-orouba-blue px-8 py-3 text-white font-bold hover:bg-blue-900 transition-colors"
            >
              {isEn ? "About Us" : "عن العروبة"}
            </Link>
          </FadeIn>
        </div>
      </section>

      {data?.brands?.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
          <FadeIn className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-orouba-blue">
              {isEn ? "Our" : ""} <span className="text-orouba-yellow">{isEn ? "Brands" : "منتجاتنا"}</span>
            </h2>
          </FadeIn>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {data.brands.slice(0, 8).map((brand: any) => {
              const brandName = localize(locale, brand.nameAr, brand.nameEn);
              const slug = (brand.nameEn || brand.nameAr || "brand").replace(/\s+/g, "-");
              const logo = brand.imageMain || brand.imageSmallMain || brand.image;

              return (
                <Link
                  key={brand.id}
                  href={`/${locale}/brands/${slug}/${brand.id}`}
                  className="group relative flex h-28 w-36 md:h-36 md:w-44 items-center justify-center transition-transform duration-300 hover:-translate-y-2"
                  title={brandName}
                >
                  <img
                    src={getImageUrl(logo)}
                    alt={brandName}
                    className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-[#f6f8fb] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction={isEn ? "right" : "left"} className={isEn ? "order-2 lg:order-1 text-left" : "order-2 lg:order-1 text-right"}>
              <h2 className="text-4xl md:text-6xl font-black text-orouba-blue leading-tight mb-8">
                {whyTitle}
              </h2>
              <h3 className="text-xl md:text-2xl font-extrabold text-orouba-blue mb-4">
                {localizedSetting(settings, locale, ["home_why_subtitle"], isEn ? "Discover the Difference in Every Bite:" : "اكتشف الفرق في كل قضمة:")}
              </h3>
              <p className="text-lg md:text-xl text-[#035297] leading-loose whitespace-pre-line font-medium">
                {whyText}
              </p>
              <Link
                href={`/${locale}/about/whoWeAre`}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-orouba-yellow px-8 py-3 text-orouba-blue font-black hover:bg-yellow-300 transition-colors"
              >
                {isEn ? "Learn More" : "المزيد"}
              </Link>
            </FadeIn>

            <FadeIn direction={isEn ? "left" : "right"} className="order-1 lg:order-2">
              <img
                src={getImageUrl(whyImage)}
                alt={isEn ? "Why Orouba" : "لماذا العروبة"}
                className="w-full max-h-[520px] object-contain"
              />
            </FadeIn>
          </div>

          <FadeIn className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-orouba-blue mb-6">
              {standardsTitle}
            </h2>
            <p className="text-lg md:text-xl text-[#035297] leading-loose font-medium">
              {standardsText}
            </p>
          </FadeIn>

          {data?.standards?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {data.standards.slice(0, 3).map((standard: any, idx: number) => (
                <FadeIn key={standard.id} delay={idx * 0.1}>
                  <div className="relative aspect-square overflow-hidden rounded-[24px] bg-orouba-blue p-8 text-white flex flex-col items-center justify-center text-center shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
                    <div className="absolute inset-0 bg-[url('/ar7.png')] bg-cover bg-center opacity-15" />
                    {standard.image && (
                      <img
                        src={getImageUrl(standard.image)}
                        alt=""
                        className="relative z-10 h-20 w-20 object-contain mb-6"
                      />
                    )}
                    <p className="relative z-10 text-base md:text-lg font-bold leading-relaxed">
                      {localize(locale, standard.descriptionAr, standard.descriptionEn)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn direction={isEn ? "right" : "left"} className={isEn ? "text-left" : "text-right"}>
            <h2 className="text-4xl md:text-6xl font-black text-orouba-blue leading-tight mb-8">
              {worldTitle}
            </h2>
            <p className="text-lg md:text-xl text-[#035297] leading-loose whitespace-pre-line font-medium">
              {worldText}
            </p>
            <Link
              href={`/${locale}/export`}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-orouba-blue px-8 py-3 text-white font-bold hover:bg-blue-900 transition-colors"
            >
              {isEn ? "Learn More" : "المزيد"}
            </Link>
          </FadeIn>
          <FadeIn direction={isEn ? "left" : "right"}>
            <img
              src={getImageUrl(worldMapImage)}
              alt={isEn ? "Orouba exports map" : "خريطة تصدير العروبة"}
              className="w-full object-contain"
            />
          </FadeIn>
        </div>
      </section>

      {data?.recipes?.length > 0 && (
        <section className="bg-[#f6f8fb] py-20 md:py-28">
          <FadeIn className="max-w-[1400px] mx-auto px-4 md:px-8 mb-10">
            <div className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-4 ${isEn ? "text-left" : "text-right"}`}>
              <h2 className="text-4xl md:text-5xl font-black text-orouba-blue">
                {isEn ? "Recommended" : "وصفات"}{" "}
                <span className="text-orouba-yellow">{isEn ? "Recipes" : "مقترحة"}</span>
              </h2>
              <Link href={`/${locale}/recipes`} className="font-bold text-orouba-blue hover:text-orouba-yellow transition-colors">
                {isEn ? "Show More" : "عرض المزيد"}
              </Link>
            </div>
          </FadeIn>
          <RecipeCarousel recipes={data.recipes} isEn={isEn} locale={locale} />
        </section>
      )}
    </div>
  );
}
