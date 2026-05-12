import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CareersForm from "@/components/careers/CareersForm";
import { getServerLocale, t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "الوظائف | العروبة" : "Careers | Orouba",
    description: locale === 'ar' 
      ? "انضم إلى فريق عمل العروبة للصناعات الغذائية."
      : "Join the Orouba Foods team.",
  };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getSiteData();
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const whyData = data.whyChooseUs || [];

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-[#0b5394]">
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span>{locale === 'ar' ? 'الوظائف' : 'Careers'}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 h-fit">
            <h1 className="text-3xl md:text-4xl font-bold text-orouba-blue mb-4">{locale === 'ar' ? 'انضم إلى فريقنا' : 'Join Our Team'}</h1>
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              {locale === 'ar' 
                ? `إذا كنت مهتمًا بالانضمام إلى عائلتنا، يرجى إرسال بريد إلكتروني يحتوي على سيرتك الذاتية وخطاب تقديمي إلى ${data?.settings?.email?.en || "oroubamail@orouba-ajwa.com"} أو ملء نموذج التوظيف أدناه:`
                : `If you're interested in joining our family, please send an email with your CV and cover letter to ${data?.settings?.email?.en || "oroubamail@orouba-ajwa.com"} or fill out the form below:`
              }
            </p>
            <CareersForm locale={locale} />
          </div>

          {/* Left Column: Why Choose Us */}
          <div className="lg:col-span-5 bg-[#0b5394] text-white rounded-[3rem] p-8 md:p-12 relative overflow-hidden h-fit">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-orouba-yellow mb-6">{locale === 'ar' ? 'لماذا تختار العمل معنا؟' : 'Why Work With Us?'}</h2>
              <p className="text-blue-50 leading-relaxed mb-12 text-lg">
                {locale === 'ar' ? 'نحن نؤمن بتعزيز المواهب وتشجيع النمو وتوفير الفرص للأفراد لتحقيق إمكاناتهم الكاملة.' : 'We believe in fostering talent, encouraging growth, and providing opportunities for individuals to achieve their full potential.'}
              </p>

              {whyData?.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {whyData.map((item: any, index: number) => (
                    <div key={item.id} className="flex gap-6 items-start bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                      <div className="w-12 h-12 shrink-0 bg-orouba-yellow text-orouba-blue font-bold text-2xl rounded-full flex items-center justify-center shadow-lg">
                        {index + 1}
                      </div>
                      <p className="text-lg font-medium leading-relaxed mt-1">{t(locale, item.descriptionAr, item.descriptionEn)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                   <div className="flex gap-6 items-start bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 shrink-0 bg-orouba-yellow text-orouba-blue font-bold text-2xl rounded-full flex items-center justify-center shadow-lg">1</div>
                      <p className="text-lg font-medium leading-relaxed mt-1">
                        {locale === 'ar' ? 'بيئة عمل مرنة وديناميكية تدعم الإبداع.' : 'Flexible and dynamic work environment that supports creativity.'}
                      </p>
                   </div>
                   <div className="flex gap-6 items-start bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 shrink-0 bg-orouba-yellow text-orouba-blue font-bold text-2xl rounded-full flex items-center justify-center shadow-lg">2</div>
                      <p className="text-lg font-medium leading-relaxed mt-1">
                        {locale === 'ar' ? 'فرص مستمرة للتطوير المهني والوظيفي.' : 'Continuous opportunities for professional and career development.'}
                      </p>
                   </div>
                   <div className="flex gap-6 items-start bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 shrink-0 bg-orouba-yellow text-orouba-blue font-bold text-2xl rounded-full flex items-center justify-center shadow-lg">3</div>
                      <p className="text-lg font-medium leading-relaxed mt-1">
                        {locale === 'ar' ? 'فوائد تنافسية ومكافآت مجزية لتقدير المجهود.' : 'Competitive benefits and rewarding incentives to recognize effort.'}
                      </p>
                   </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
