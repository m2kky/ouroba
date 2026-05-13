import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "من نحن | Orouba Foods" : "Who We Are | Orouba Foods",
    description: locale === 'ar' 
      ? "تعرف على تاريخ العروبة للصناعات الغذائية، قيمنا، ومعايير الجودة."
      : "Learn about the history of Orouba Foods, our values, and quality standards.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const data = await getSiteData();
  const { settings, buildings, productionSteps, sectionTexts, features } = data;

  const aboutImage = settings?.about_image?.en || settings?.about_image?.ar;
  const smallAboutImage = settings?.small_about_img?.en || settings?.small_about_img?.ar || aboutImage;
  const quotationEn = settings?.quotation_en?.en || settings?.quotation?.en || "We believe food brings people together. That’s why we offer a wide range of delicious frozen products, from fresh veggies, fruits, and beans to flavorful falafel and appetizers. We're always innovating to offer exciting new choices made with simple, all-natural ingredients. We make in-the-kitchen experiences easy, quick and fun for everyone. Our aim is to inspire joyful mealtimes and help you share the magic of food with your loved ones.";
  const quotationAr = settings?.quotation_ar?.ar || settings?.quotation?.ar || "نحن نؤمن بأن الطعام يجمع الناس معًا. لهذا السبب نقدم مجموعة واسعة من المنتجات المجمدة اللذيذة، من الخضار الطازجة والفواكه والفاصوليا إلى الفلافل والمقبلات اللذيذة. نحن نبتكر دائمًا لتقديم خيارات جديدة ومثيرة مصنوعة من مكونات بسيطة وطبيعية بالكامل. نحن نجعل تجارب الطهي سهلة وسريعة وممتعة للجميع. هدفنا هو إلهام أوقات الوجبات المبهجة ومساعدتك على مشاركة سحر الطعام مع أحبائك.";

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 mt-28 mb-8">
        <nav className="flex text-sm text-gray-500 font-medium" style={{ justifyContent: locale === 'en' ? 'flex-start' : 'flex-end', flexDirection: locale === 'ar' ? 'row-reverse' : 'row' }}>
          <Link href={`/${locale}`} className="hover:text-[#035297]">
            {locale === 'ar' ? "الصفحة الرئيسية" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">
            {locale === 'ar' ? "عن العروبة" : "About US"}
          </span>
          <span className="mx-2">/</span>
          <span className="text-[#035297] font-bold">
            {locale === 'ar' ? "من نحن" : "Who We Are "}
          </span>
        </nav>
      </div>

      <div className="container mx-auto px-4 text-start max-w-7xl">
        {/* Main Image */}
        <div className="flex flex-col md:flex-row mb-12 justify-center">
          <div className="w-full">
            <picture>
              <source media="(max-width: 500px)" srcSet={smallAboutImage} />
              <img
                src={aboutImage}
                alt="who we are"
                className="w-full h-auto object-cover rounded-xl"
              />
            </picture>
          </div>
        </div>

        {/* Sections */}
        {sectionTexts && sectionTexts.map((item: any) => (
          <div key={item.id} className="mb-10 w-full" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
            <h3 
              className="text-[28px] font-bold mb-4 text-[#035297]"
            >
              {locale === 'en' ? item.titleEn : item.titleAr}
            </h3>
            <div 
              className="text-[#7a7a7a] leading-relaxed text-lg"
              style={{ 
                marginRight: locale === 'en' ? 'auto' : '0',
                marginLeft: locale === 'ar' ? 'auto' : '0'
              }}
              dangerouslySetInnerHTML={{
                __html: locale === 'en' ? item.textEn : item.textAr,
              }}
            />
          </div>
        ))}

        {/* Buildings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-12 mb-16">
          {buildings && buildings.map((item: any) => (
            <div key={item.id} className="flex gap-4 items-start text-start" style={{ textAlign: locale === 'en' ? 'left' : 'right', flexDirection: locale === 'ar' ? 'row-reverse' : 'row' }}>
              <div>
                <h4 className="text-[24px] text-[#035297] font-bold mb-2">
                  {locale === 'en' ? item.titleEn : item.titleAr}
                </h4>
                <p className="text-[18px] text-[#7a7a7a] leading-relaxed">
                  {locale === 'en' ? item.descriptionEn : item.descriptionAr}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features / Areas */}
        <div className="mt-16 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
            {features && features.map((item: any) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                <img src={item.image} alt={item.titleEn} className="mb-4 max-w-full rounded-xl" />
                <h5 className="font-bold text-[20px] text-[#035297] mb-3">
                  <b>{locale === 'en' ? item.titleEn : item.titleAr}</b>
                </h5>
                <p className="w-3/4 mx-auto text-[#7a7a7a] leading-relaxed">
                  {locale === 'en' ? item.descriptionEn : item.descriptionAr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Production Steps */}
        <div className="mt-20">
          <h4 className="text-[40px] text-[#035297] font-bold mb-12" style={{ textAlign: locale === 'en' ? 'left' : 'right' }}>
            {locale === 'ar' ? "مراحل الإنتاج" : "Production Steps"}
          </h4>
          <div className="flex flex-col gap-16">
            {productionSteps && productionSteps.map((item: any, index: number) => (
              <div key={item.id} className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <img src={item.image} alt="Production Step" className="w-full h-auto rounded-xl shadow-sm" />
                </div>
                <div 
                  className="w-full md:w-1/2 [&_b]:text-[#035297] [&_b]:text-xl [&_li]:mb-4 [&_ul]:list-none [&_ul]:p-0 [&_span]:text-[#7a7a7a] [&_span]:text-lg"
                  style={{ textAlign: locale === 'en' ? 'left' : 'right' }}
                  dangerouslySetInnerHTML={{
                    __html: locale === 'ar' ? item.textAr : item.textEn,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quotation */}
        <div className="mt-24 mb-10 flex flex-col items-center justify-center text-center">
          {locale === 'ar' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="23" viewBox="0 0 35 23" fill="none">
              <path d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z" fill="#035297"/>
              <path d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z" fill="#035297"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="23" viewBox="0 0 35 23" fill="none">
              <path d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z" fill="#035297"/>
              <path d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z" fill="#035297"/>
            </svg>
          )}

          <p className="my-6 text-[23px] text-[#035297] leading-relaxed max-w-4xl text-center font-medium">
            {locale === 'ar' ? quotationAr : quotationEn}
          </p>

          {locale === 'ar' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="23" viewBox="0 0 35 23" fill="none">
              <path d="M27.1442 12.9029L28.1174 12.8802C38.7773 12.6992 35.224 -2.96249 23.8172 1.17923C15.398 4.23461 16.9596 18.2893 25.9673 20.5978C29.9506 21.6163 34.3866 20.892 31.0822 19.7604C28.2532 18.8099 25.9673 16.0714 26.1258 13.8308C26.171 13.3329 26.601 12.9029 27.1442 12.9029Z" fill="#035297"/>
              <path d="M6.3446 0.613303C-3.90788 4.55134 0.256468 21.752 11.6406 22.4989C14.6054 22.7026 15.3749 22.001 13.1343 21.1636C10.9616 20.3488 8.22309 16.5013 7.92886 13.8986C7.86097 13.378 8.2683 12.948 8.78885 12.948C11.7763 12.948 13.0212 12.948 14.7638 10.549C19.0414 4.61933 13.3606 -2.07995 6.3446 0.613303Z" fill="#035297"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="23" viewBox="0 0 35 23" fill="none">
              <path d="M7.85555 12.9029L6.88235 12.8802C-3.7775 12.6992 -0.224218 -2.96249 11.1825 1.17923C19.6018 4.23461 18.0401 18.2893 9.03243 20.5978C5.04913 21.6163 0.613184 20.892 3.91751 19.7604C6.74656 18.8099 9.03243 16.0714 8.87401 13.8308C8.82874 13.3329 8.39873 12.9029 7.85555 12.9029Z" fill="#035297"/>
              <path d="M28.6552 0.613303C38.9076 4.55134 34.7433 21.752 23.3592 22.4989C20.3944 22.7026 19.6248 22.001 21.8654 21.1636C24.0382 20.3488 26.7767 16.5013 27.0709 13.8986C27.1388 13.378 26.7315 12.948 26.2109 12.948C23.2234 12.948 21.9786 12.948 20.2359 10.549C15.9584 4.61933 21.6391 -2.07995 28.6552 0.613303Z" fill="#035297"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
