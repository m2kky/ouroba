/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSiteData, getImageUrl } from "@/lib/api-client";
import FadeIn from "@/components/ui/FadeIn";
import HoverCard from "@/components/ui/HoverCard";

interface BannerItem { id: string; isHidden: boolean; type: string; videoLink?: string; videoLinkEn?: string; image?: string; imageEn?: string; smallVideo?: string; smallVideoEn?: string; smallImg?: string; smallImgEn?: string; }
interface SectionTextItem { id: string; titleEn?: string; titleAr?: string; textEn?: string; textAr?: string; number: number; }
interface BrandItem { id: string; nameEn?: string; nameAr?: string; image?: string; }
interface WhyItem { id: string; descriptionEn?: string; descriptionAr: string; }
interface StandardItem { id: string; descriptionEn?: string; descriptionAr: string; image?: string; }
interface RecipeItem { id: string; nameEn?: string; nameAr?: string; internalImage?: string; tagEn?: string; tagAr?: string; }

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const isEn = locale === "en";

  const data = await getSiteData();
  const { brands, banners, sectionTexts, whyChooseUs, standards } = data;

  // Hero Banner
  const activeBanners = banners?.filter((b: BannerItem) => !b.isHidden) || [];
  const firstBanner = activeBanners[0];
  
  // Desktop Media
  const fallbackVideo = isEn 
    ? "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/1_en.mp4"
    : "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/1.mp4";
  const isVideoDesktop = firstBanner ? firstBanner.type === "video" : true;
  
  const desktopVideoToUse = isEn ? (firstBanner?.videoLinkEn || firstBanner?.videoLink) : firstBanner?.videoLink;
  const desktopImageToUse = isEn ? (firstBanner?.imageEn || firstBanner?.image) : firstBanner?.image;
  const mediaDesktop = desktopVideoToUse || desktopImageToUse || fallbackVideo;
  
  // Mobile Media
  const mobileVideoToUse = isEn ? (firstBanner?.smallVideoEn || firstBanner?.smallVideo) : firstBanner?.smallVideo;
  const mobileImageToUse = isEn ? (firstBanner?.smallImgEn || firstBanner?.smallImg) : firstBanner?.smallImg;
  
  const mediaMobile = mobileVideoToUse || mobileImageToUse || mediaDesktop;
  const isVideoMobile = firstBanner ? !!mobileVideoToUse || (!mobileImageToUse && isVideoDesktop) : true;

  // Vision Section Text (Assuming number 1 or specific title)
  const visionSection = sectionTexts?.find((s: SectionTextItem) => s.titleEn?.toLowerCase().includes("vision") || s.number === 1);
  const worldSection = sectionTexts?.find((s: SectionTextItem) => s.titleEn?.toLowerCase().includes("world") || s.titleAr?.includes("حول العالم"));

  return (
    <div className="bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden -mt-4">
        
        {/* Desktop View */}
        <div className="hidden md:block w-full">
          {isVideoDesktop ? (
            <video 
              src={mediaDesktop} 
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              className="w-full h-auto max-h-[85vh] object-cover z-0 block"
            />
          ) : (
            <img 
              src={mediaDesktop} 
              alt="Hero Banner"
              className="w-full h-auto max-h-[85vh] object-cover z-0 block"
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden w-full">
          {isVideoMobile ? (
            <video 
              src={mediaMobile} 
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              className="w-full h-auto object-cover z-0 block"
            />
          ) : (
            <img 
              src={mediaMobile} 
              alt="Hero Banner"
              className="w-full h-auto object-cover z-0 block"
            />
          )}
        </div>

      </section>

      {/* 2. From Vision to Reality */}
      <section className="py-6 md:py-10 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
          <FadeIn direction={isEn ? "left" : "right"} className="w-full md:w-1/2 relative flex justify-center">
             <img src="https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.webp" alt="Orouba Products" className="w-[60%] md:w-3/4 max-w-sm h-auto object-contain" />
          </FadeIn>
          <FadeIn direction={isEn ? "right" : "left"} delay={0.2} className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-8 leading-tight">
              {isEn ? "From Vision to Reality" : "من الرؤية إلى الواقع"}
            </h2>
            <p className="text-base font-medium tracking-tight text-gray-700 leading-relaxed mb-8 md:mb-10 text-justify whitespace-pre-wrap">
              {isEn 
                ? (visionSection?.textEn || "Orouba for Food industry Co. was founded in 1998, with a vision to produce premium quality frozen food products. Our 20,000 square meter factory, equipped with state of the art technology and operated by our skilled engineers, ensures top quality production. \nCommitted to consumer satisfaction, we offer a diverse range of frozen vegetables, fruits, beans, and pre-fried products, made with simple, all natural ingredients.")
                : (visionSection?.textAr || "تأسست شركة العروبة لصناعة المواد الغذائية سنة ١٩٩٨، برؤية تهدف للتمييز فى انتاج و ابتكار منتجات غذائية مجمدة عالية الجودة وسريعة الطهى لجميع انحاء العالم. تبلغ مساحة المصنع ٢٠,٠٠٠ متر مربع،وهو مجهز بأحدث التقنيات، تحت إشراف وإدارة فريق من المهندسين والعامليين ذوى الخبرة والكفاءة العالية لضمان انتاج عالى الجودة وفقا للمعايير الدولية. حرصا منا على إرضاء عملائنا والحفاظ على ثقتهم، فإننا نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات، فواكة، بقوليات، حبوب وأيضا فلافل ومنتجات نصف مقلية مجمدة يتم إنتاجها جميعا من مكونات طبيعية دون أى اضافات.")}
            </p>
            <Link href={`/${locale}/about/whoWeAre`} className="inline-flex items-center justify-center gap-2 bg-orouba-yellow text-orouba-blue font-bold px-8 py-3 rounded-full text-lg hover:bg-yellow-400 transition-colors shadow-md w-fit">
              <span>{isEn ? "About Orouba" : "عن العروبة"}</span>
              <ChevronLeft className={`w-5 h-5 stroke-[3] ${isEn ? "rotate-180" : ""}`} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 3. Our Brands */}
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <FadeIn direction="up" className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-4">{isEn ? "Our Brands" : "منتجاتنا"}</h2>
          </FadeIn>
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 md:mx-auto md:px-0">
            {brands?.slice(0, 3).map((brand: BrandItem, index: number) => {
              const slugName = (brand.nameEn || brand.nameAr || 'brand').replace(/\s+/g, '-');
              return (
              <FadeIn key={brand.id} direction="up" delay={0.1 * (index + 1)} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center md:h-full">
                <Link href={`/${locale}/brands/${slugName}/${brand.id}`} className="block h-[400px]">
                  <HoverCard className="rounded-[30px] overflow-hidden shadow-xl h-full relative group cursor-pointer border-4 border-white/20">
                    <img 
                      src={getImageUrl(brand.image) || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"} 
                      alt={isEn ? brand.nameEn || brand.nameAr : brand.nameAr} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl drop-shadow-md">{isEn ? brand.nameEn || brand.nameAr : brand.nameAr}</span>
                    </div>
                  </HoverCard>
                </Link>
              </FadeIn>
              );
            })}
          </div>
          
          {brands && brands.length > 3 && (
            <FadeIn direction="up" delay={0.4} className="text-center mt-12">
              <Link href={`/${locale}/brands`} className="inline-block border-2 border-orouba-blue text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-orouba-blue hover:text-white transition-colors">
                {isEn ? "View All Brands" : "عرض كل البراندات"}
              </Link>
            </FadeIn>
          )}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-6 md:py-10 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <FadeIn direction={isEn ? "left" : "right"} className="w-full md:w-1/2 relative flex justify-center">
             <img src="https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.webp" alt="Plates" className="w-[80%] md:w-full max-w-md h-auto object-contain rounded-3xl" />
          </FadeIn>
          <FadeIn direction={isEn ? "right" : "left"} delay={0.2} className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-4">{isEn ? "Why Orouba?" : "لماذا العروبة ؟"}</h2>
            <div className="space-y-6 mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{isEn ? "Discover the Difference in Every Bite:" : "اكتشف الفرق في كل قضمة:"}</h3>
              <div className="text-xl text-gray-600 leading-relaxed text-justify whitespace-pre-line space-y-4">
                <p>
                  {isEn 
                    ? "Choosing Orouba means opting for quality, convenience, and a touch of culinary delight. Our all-natural, delicious products cater to diverse tastes, making meal prep easy and fun. Trust Orouba to turn ordinary meals into extraordinary experiences and bring joy to your kitchen. Join us and discover the delight of cooking with Orouba!"
                    : "يعد اختيار العروبة هو اختيار التميز والسهولة ومتعة الطهي وذلك لإلتزامنا بالمعايير الدولية وشغفنا بالابتكار. تلبي منتجاتنا الطبيعية واللذيذة أذواقًا متنوعة، و تجعل إعداد الطعام أكثر سهولة ومتعة. ثق في العروبة لتحويل الوجبات العادية إلى تجارب غير تقليدية وإضفاء البهجة على مطبخك ومائدتك انضم إلينا واكتشف متعة الطهي مع العروبة!!"}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. Our Standards */}
      <section className="py-6 md:py-10 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-5xl font-bold text-orouba-blue mb-8">{isEn ? "Our Standards" : "معاييرنا"}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {isEn ? "At Orouba, we adhere to the highest quality standards to ensure every product we offer meets your needs and exceeds expectations." : "نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك."}
            </p>
          </FadeIn>
          
          {standards && standards.length > 0 ? (
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 md:mx-auto md:px-0">
              {standards.map((standard: StandardItem, idx: number) => (
                <FadeIn key={standard.id} direction="up" delay={0.1 * (idx + 1)} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center">
                  <div className="bg-[#1e4a8c] p-6 md:p-6 rounded-[2rem] text-white h-[320px] md:h-[300px] flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                    {/* Abstract Wave Background Texture */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none transition-transform duration-700 group-hover:scale-110">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
                        <path d="M0,0 C30,40 70,0 100,20 L100,100 L0,100 Z" />
                        <path d="M0,100 C30,60 70,100 100,80 L100,0 L0,0 Z" className="opacity-50" />
                      </svg>
                    </div>
                    
                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {standard.image ? (
                      <div className="w-16 h-16 md:w-20 md:h-20 mb-5 relative z-10 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-2">
                        <img 
                          src={standard.image} 
                          alt="Standard Icon" 
                          className="w-full h-full object-contain filter invert brightness-0 drop-shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 mb-5 relative z-10 flex items-center justify-center">
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      </div>
                    )}
                    <p className="text-base md:text-sm font-bold leading-relaxed relative z-10 text-center px-2">{isEn ? standard.descriptionEn || standard.descriptionAr : standard.descriptionAr}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : null}

          {/* More Button */}
          <FadeIn direction="up" className="text-center mt-8">
            <Link href={`/${locale}/export`} className={`inline-flex items-center gap-2 text-2xl font-bold text-[#1e4a8c] hover:text-blue-900 transition-colors ${isEn ? "flex-row-reverse" : ""}`}>
              <ChevronLeft className={`w-6 h-6 stroke-[3] ${isEn ? "rotate-180" : ""}`} />
              <span>{isEn ? "More" : "المزيد"}</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 6. Orouba Around The World */}
      <section className="py-6 md:py-10 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <FadeIn direction={isEn ? "left" : "right"} className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-blue">{isEn ? "Orouba Around The World" : "العروبة حول العالم"}</h2>
            <p className="text-lg text-gray-700 leading-loose mb-10 text-justify font-medium">
              {isEn 
                ? (worldSection?.textEn || "Our extensive network guarantees timely delivery to over 50 countries worldwide. Our journey began in Egypt, and now, we are present in the Middle East, Europe, Japan, USA & Australia.")
                : (worldSection?.textAr || "تلتزم العروبة بتوسيع نطاق انتشارها عالميًا، حيث توفر منتجاتها عالية الجودة لمختلف موائد العالم. تضمن شبكتنا الواسعة إيصال منتجاتنا طوال العام لأكثر من ٥٠ دولة حول العالم. أنطلقت رحلتنا من مصر، والآن نحن نتواجد في الشرق الأوسط ،أوروبا ،اليابان ،الولايات المتحدة الأمريكية ، كندا وأستراليا، حاملين معنا نكهات استثنائية و تجارب طهى لا مثيل لها.")}
            </p>
            <Link href={`/${locale}/export`} className="inline-block bg-orouba-yellow text-orouba-blue font-bold px-10 py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors shadow-sm">
              {isEn ? "More >" : "المزيد >"}
            </Link>
          </FadeIn>
          <FadeIn direction={isEn ? "right" : "left"} delay={0.2} className="w-full md:w-1/2 flex justify-center">
            {/* The exact map image from their original website */}
            <div className="relative w-full max-w-[600px] h-[350px]">
              <img 
                src="https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.webp"
                alt="Orouba World Map" 
                className="w-full h-full object-contain"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. Suggested Recipes */}
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          <FadeIn direction="up">
            <h2 className="text-5xl font-bold text-orouba-blue mb-16">{isEn ? "Suggested Recipes" : "وصفات مقترحة"}</h2>
          </FadeIn>
          
          <div className="flex gap-4 md:gap-8 mb-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 md:mx-auto md:px-0 md:justify-center">
            {data?.recipes?.slice(0, 3).map((recipe: RecipeItem, index: number) => {
              const imageSrc = recipe.internalImage?.startsWith("http") 
                ? recipe.internalImage 
                : recipe.internalImage?.startsWith("/uploads") || recipe.internalImage?.startsWith("/storage")
                  ? recipe.internalImage
                  : recipe.internalImage 
                    ? `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${recipe.internalImage}`
                    : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

              return (
                <FadeIn key={recipe.id} direction="up" delay={0.1 * (index + 1)} className="w-[75vw] sm:w-[45vw] md:w-[350px] lg:w-[400px] flex-shrink-0 snap-center">
                  <Link href={`/${locale}/recipes/${recipe.id}`} className="group block h-[450px]">
                    <HoverCard className="rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full relative block">
                      
                      {/* Full Background Image */}
                      <img src={imageSrc} alt={isEn ? recipe.nameEn || recipe.nameAr : recipe.nameAr} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0" />
                      
                      {/* Permanent Gradient Overlay for text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                      {/* Recipe Type Label */}
                      <div className={`absolute top-6 ${isEn ? "left-6" : "right-6"} z-20`}>
                        <span className="bg-orouba-yellow/95 backdrop-blur-sm text-orouba-blue text-sm font-extrabold px-5 py-2 rounded-full shadow-lg uppercase tracking-wider">
                          {isEn ? (recipe.tagEn || "Special Recipe") : (recipe.tagAr || "وصفة مميزة")}
                        </span>
                      </div>

                      {/* Content at Bottom */}
                      <div className={`absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full ${isEn ? "text-left" : "text-right"}`}>
                        <h3 className="text-3xl font-bold text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{isEn ? recipe.nameEn || recipe.nameAr : recipe.nameAr}</h3>
                        <div className={`flex items-center text-white/80 opacity-0 group-hover:opacity-100 font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ${isEn ? "" : "flex-row-reverse justify-end"}`}>
                          <span>{isEn ? "View Recipe" : "عرض الوصفة"}</span>
                          <svg className={`w-5 h-5 ${isEn ? "ml-2 rotate-180" : "mr-2"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                      </div>

                    </HoverCard>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn direction="up" delay={0.4}>
            <Link href={`/${locale}/recipes`} className="inline-block border-2 border-orouba-blue text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-orouba-blue hover:text-white transition-colors">
              {isEn ? "View More" : "عرض المزيد"}
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
