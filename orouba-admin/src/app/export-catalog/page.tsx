import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CollaborateForm from "@/components/export/CollaborateForm";

export const metadata: Metadata = {
  title: "تحميل الكتالوج | العروبة",
  description: "مرحباً بكم في تصدير الكتالوج. يمكنك تحميل الكتالوج الخاص بمنتجات العروبة.",
};

export default async function ExportCatalogPage() {
  const data = await getSiteData();
  const settings = data.settings || {};

  // Find the catalogue link and image if they exist in settings, or use fallbacks
  // From old site: exportCatData?.catalog_file, catalog_image, catalog_ar, catalog_en
  const catalogFile = settings.catalog_file?.ar || "https://camp-coding.site/eloroba/storage/app/public/catalog.pdf";
  const catalogImage = settings.catalog_image?.ar || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";
  const catalogText = settings.catalog_text?.ar || "نسعى دائماً لتقديم الأفضل لعملائنا في جميع أنحاء العالم. اكتشف منتجاتنا المتنوعة وعالية الجودة من خلال كتالوج التصدير الخاص بنا.";

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-32" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-orouba-blue">
          <Link href="/" className="hover:text-orouba-yellow transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-5 h-5 mt-1" />
          <span>التصدير</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Banner Section */}
        <div className="bg-orouba-blue rounded-[3rem] overflow-hidden shadow-2xl relative mb-16 flex flex-col md:flex-row items-center border border-gray-100">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="w-full md:w-1/2 p-10 md:p-16 relative z-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold text-orouba-yellow mb-6 leading-tight">
              مرحباً بكم في كتالوج التصدير
            </h1>
            <p className="text-lg leading-loose mb-10 text-blue-50 font-medium">
              {catalogText}
            </p>
            <a 
              href={catalogFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-orouba-yellow text-orouba-blue font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-400 transition-colors shadow-md text-center"
            >
              تحميل الكتالوج
            </a>
          </div>

          <div className="w-full md:w-1/2 bg-white/5 h-full flex items-center justify-center p-10 relative z-10">
            <div className="bg-white rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 w-full max-w-sm">
              <img 
                src={catalogImage} 
                alt="كتالوج العروبة" 
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
        
        {/* Collaborate Form */}
        <CollaborateForm locale="ar" />
      </div>
    </div>
  );
}
