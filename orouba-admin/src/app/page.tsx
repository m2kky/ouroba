import Image from "next/image";
import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import FadeIn from "@/components/ui/FadeIn";
import HoverCard from "@/components/ui/HoverCard";

export default async function HomePage() {
  const data = await getSiteData();
  const { brands, banners, sectionTexts, whyChooseUs, features, continents, recipes } = data;

  // Hero Banner
  const desktopBanners = banners?.filter((b: any) => b.isDesktop && !b.isHidden) || [];
  const firstBanner = desktopBanners[0];
  const isVideo = firstBanner?.type === "video";
  const heroMedia = firstBanner?.image || "https://camp-coding.site/eloroba/storage/app/images/1.mp4"; // Fallback

  // Vision Section Text (Assuming number 1 or specific title)
  const visionSection = sectionTexts?.find((s: any) => s.titleEn?.toLowerCase().includes("vision") || s.number === 1);

  return (
    <div className="bg-white" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden flex items-center justify-center bg-gray-900 min-h-[50vh]">
        {isVideo ? (
          <video 
            src={heroMedia} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto max-h-[85vh] object-cover z-0 block"
          />
        ) : (
          <img 
            src={heroMedia} 
            alt="Hero Banner"
            className="w-full h-auto max-h-[85vh] object-cover z-0 block"
          />
        )}
      </section>

      {/* 2. From Vision to Reality */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <FadeIn direction="right" className="w-full md:w-1/2 order-2 md:order-1 relative">
             <img src="https://camp-coding.site/eloroba/storage/app/images/ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.png" alt="Orouba Products" className="w-full h-auto object-contain drop-shadow-2xl" />
          </FadeIn>
          <FadeIn direction="left" delay={0.2} className="w-full md:w-1/2 order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-8 leading-tight">
              {visionSection?.titleAr || "من الرؤية إلى الواقع"}
            </h2>
            <p className="text-lg text-gray-600 leading-loose mb-10 text-justify whitespace-pre-wrap">
              {visionSection?.textAr || "تأسست شركة العروبة لصناعة المواد الغذائية سنة ١٩٩٨، برؤية تهدف للتمييز فى انتاج و ابتكار منتجات غذائية مجمدة عالية الجودة وسريعة الطهى لجميع انحاء العالم. تبلغ مساحة المصنع ٢٠,٠٠٠ متر مربع، وهو مجهز بأحدث التقنيات، تحت إشراف وإدارة فريق من المهندسين والعامليين ذوى الخبرة والكفاءة العالية لضمان انتاج عالى الجودة وفقا للمعايير الدولية. حرصا منا على إرضاء عملائنا والحفاظ على ثقتهم، فإننا نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات، فواكة، بقوليات، حبوب وأيضا فلافل ومنتجات نصف مقلية مجمدة يتم إنتاجها جميعا من مكونات طبيعية دون أى اضافات."}
            </p>
            <Link href="/about/whoWeAre" className="inline-block bg-orouba-yellow text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-400 transition-colors shadow-md">
              عن العروبة
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 3. Our Brands */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-5xl font-bold text-orouba-blue mb-4">منتجاتنا</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands?.slice(0, 3).map((brand: any, index: number) => (
              <FadeIn key={brand.id} direction="up" delay={0.1 * (index + 1)} className="h-full">
                <Link href={`/brands/${brand.id}`} className="block h-full">
                  <HoverCard className="rounded-[30px] overflow-hidden shadow-xl h-[400px] relative group cursor-pointer">
                    <img 
                      src={brand.image || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"} 
                      alt={brand.nameAr} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl drop-shadow-md">{brand.nameAr}</span>
                    </div>
                  </HoverCard>
                </Link>
              </FadeIn>
            ))}
          </div>
          
          {brands && brands.length > 3 && (
            <FadeIn direction="up" delay={0.4} className="text-center mt-12">
              <Link href="/brands" className="inline-block border-2 border-orouba-blue text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-orouba-blue hover:text-white transition-colors">
                عرض كل البراندات
              </Link>
            </FadeIn>
          )}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
        <div className="absolute -right-20 top-20 w-64 h-64 bg-orouba-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <FadeIn direction="right" className="w-full md:w-1/2 relative">
             <div className="absolute -bottom-10 -right-10 w-full h-full bg-orouba-yellow rounded-3xl opacity-20 -z-10"></div>
             <img src="https://camp-coding.site/eloroba/storage/app/images/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png" alt="Plates" className="w-full h-[500px] object-contain rounded-3xl" />
          </FadeIn>
          <FadeIn direction="left" delay={0.2} className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-4">لماذا العروبة ؟</h2>
            {whyChooseUs && whyChooseUs.length > 0 ? (
              <div className="space-y-6 mt-8">
                {whyChooseUs.map((reason: any) => (
                  <p key={reason.id} className="text-xl text-gray-600 leading-relaxed text-justify">
                    {reason.descriptionAr}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-8 mt-4">اكتشف الفرق في كل قضمة:</h3>
                <p className="text-xl text-gray-600 leading-loose mb-10 text-justify">
                  يعد اختيار العروبة هو اختيار التميز والسهولة ومتعة الطهي وذلك لإلتزامنا بالمعايير الدولية وشغفنا بالابتكار. تلبي منتجاتنا الطبيعية واللذيذة أذواقًا متنوعة، و تجعل إعداد الطعام أكثر سهولة ومتعة. ثق في العروبة لتحويل الوجبات العادية إلى تجارب غير تقليدية وإضفاء البهجة على مطبخك ومائدتك. انضم إلينا واكتشف متعة الطهي مع العروبة!!.
                </p>
              </>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 5. Our Standards */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl font-bold text-orouba-blue mb-8">معاييرنا</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              نلتزم في العروبة بأعلى معايير الجودة لضمان أن كل منتج نقدمه يلبي احتياجاتك ويتجاوز توقعاتك.
            </p>
          </FadeIn>
          
          {standards && standards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {standards.map((standard: any, idx: number) => (
                <FadeIn key={standard.id} direction="up" delay={0.1 * (idx + 1)}>
                  <HoverCard className="text-center p-6 border border-gray-100 rounded-3xl hover:shadow-xl transition-shadow bg-gray-50 h-full">
                    {standard.image ? (
                      <div className="w-20 h-20 mx-auto mb-6">
                        <img src={standard.image} alt="Standard" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">✨</div>
                    )}
                    <p className="text-lg text-gray-700 font-medium">{standard.descriptionAr}</p>
                  </HoverCard>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FadeIn direction="up" delay={0.1}>
                <HoverCard className="text-center p-6 border border-gray-100 rounded-3xl hover:shadow-xl transition-shadow bg-gray-50 h-full">
                  <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">🍃</div>
                  <p className="text-lg text-gray-700 font-medium">جميع المنتجات خالية من أي مواد حافظة أو مواد كيماوية</p>
                </HoverCard>
              </FadeIn>
            </div>
          )}
        </div>
      </section>

      {/* 6. Orouba Around The World */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <FadeIn direction="right" className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-blue">العروبة حول العالم</h2>
            <p className="text-lg text-gray-700 leading-loose mb-10 text-justify font-medium">
              تلتزم العروبة بتوسيع نطاق انتشارها عالميًا، حيث توفر منتجاتها عالية الجودة لمختلف موائد العالم. تضمن شبكتنا الواسعة إيصال منتجاتنا طوال العام لأكثر من ٥٠ دولة حول العالم. أنطلقت رحلتنا من مصر، والآن نحن نتواجد في الشرق الأوسط ،أوروبا ،اليابان ،الولايات المتحدة الأمريكية ، كندا وأستراليا.
            </p>
            <Link href="/export" className="inline-block bg-orouba-yellow text-orouba-blue font-bold px-10 py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors shadow-sm">
              المزيد &gt;
            </Link>
          </FadeIn>
          <FadeIn direction="left" delay={0.2} className="w-full md:w-1/2 flex justify-center">
            {/* The exact map image from their original website */}
            <div className="relative w-full max-w-[600px] h-[350px]">
              <img 
                src="https://camp-coding.site/eloroba/storage/app/images/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.jpg"
                alt="Orouba World Map" 
                className="w-full h-full object-contain"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. Suggested Recipes */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          <FadeIn direction="up">
            <h2 className="text-5xl font-bold text-orouba-blue mb-16">وصفات مقترحة</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-right">
            {data?.recipes?.slice(0, 3).map((recipe: any, index: number) => {
              const imageSrc = recipe.internalImage?.startsWith("http") 
                ? recipe.internalImage 
                : recipe.internalImage 
                  ? `https://camp-coding.site/eloroba/${recipe.internalImage}`
                  : "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

              return (
                <FadeIn key={recipe.id} direction="up" delay={0.1 * (index + 1)}>
                  <Link href={`/recipes/details/${recipe.id}/ar`} className="group block h-full">
                    <HoverCard className="rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[450px] relative">
                      
                      {/* Full Background Image */}
                      <img src={imageSrc} alt={recipe.nameAr || ""} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0" />
                      
                      {/* Permanent Gradient Overlay for text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                      {/* Content at Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full">
                        <h3 className="text-3xl font-bold text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{recipe.nameAr}</h3>
                        <div className="flex items-center text-white/80 opacity-0 group-hover:opacity-100 font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <span>عرض الوصفة</span>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                      </div>

                    </HoverCard>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn direction="up" delay={0.4}>
            <Link href="/recipes/ar" className="inline-block border-2 border-orouba-blue text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-orouba-blue hover:text-white transition-colors">
              عرض المزيد
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
