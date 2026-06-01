import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CareersForm from "@/components/careers/CareersForm";
import { getServerLocale, t } from "@/lib/server-locale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "وظائف | العروبة" : "Careers | Orouba",
    description: locale === 'ar' 
      ? "انضم إلى فريق عمل العروبة للصناعات الغذائية."
      : "Join the Orouba Foods team.",
  };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getSiteData();
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <div className="bg-white min-h-screen pb-20 pt-32">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-[#0b5394]">
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <ChevronLeft className={`w-5 h-5 mt-1 ${locale === 'en' ? 'rotate-180' : ''}`} />
          <span>{locale === 'ar' ? 'الوظائف' : 'Careers'}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-[url('/backsd.jpg')] bg-cover bg-center rounded-[2.5rem] relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column (Form) */}
            <div className="p-6 md:p-12 relative z-10 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#002f59] mb-2">{locale === 'ar' ? 'انضم إلى فريقنا' : 'Join Our Team'}</h1>
              <p className="text-[#002f59] font-bold text-sm md:text-base mb-8 leading-relaxed">
                {locale === 'ar' 
                  ? `إذا كنت مهتمًا بالانضمام إلى عائلتنا، يرجى إرسال بريد إلكتروني يحتوي على سيرتك الذاتية وخطاب تقديمي إلى ${data?.settings?.email?.en || "oroubamail@orouba.ajwa.com"} أو ملء نموذج التوظيف`
                  : `If you are interested in joining our family, please send an email with your resume and cover letter to ${data?.settings?.email?.en || "oroubamail@orouba.ajwa.com"} or fill out the employment form`
                }
              </p>
              <CareersForm locale={locale as "ar"|"en"} />
            </div>

            {/* Right Column (Empty to show map texture) */}
            <div className="hidden lg:block relative z-10"></div>
          </div>
        </div>

        {/* Why Choose Us Section (Under the form) */}
        <div className="mt-16 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#002f59] mb-4">{locale === 'ar' ? 'لماذا تختار العمل معنا؟' : 'Why Choose Us ?'}</h2>
            <p className="text-[#002f59] font-bold text-base max-w-3xl mx-auto mb-10">
              {locale === 'ar' ? 'نحن نؤمن بتعزيز المواهب وتشجيع النمو وتوفير الفرص للأفراد لتحقيق إمكاناتهم الكاملة' : 'We believe in fostering talent, encouraging growth and providing opportunities for individuals to achieve their full potential'}
            </p>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
              {[
                { ar: "بيئة عمل ديناميكية", en: "Dynamic Work Environment" },
                { ar: "فوائد تنافسية", en: "Competitive Benefits" },
                { ar: "التطوير الوظيفي", en: "Career Development" },
                { ar: "احداث فرق", en: "Make a Difference" },
                { ar: "فرص النمو", en: "Opportunities for Growth" },
                { ar: "تحديات مليئة بالابتكار والإبداع", en: "Innovation and Creativity Challenges" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 shrink-0 bg-orouba-yellow rounded-full"></div>
                  <p className="text-[#002f59] font-extrabold text-lg">
                    {locale === 'ar' ? item.ar : item.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
