import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CollaborateForm from "@/components/export/CollaborateForm";

export const metadata: Metadata = {
  title: "تحميل الكتالوج | العروبة",
  description: "مرحباً بكم في تصدير الكتالوج. يمكنك تحميل الكتالوج الخاص بمنتجات العروبة.",
};

export default async function ExportCatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const data = await getSiteData();
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const isEn = locale === 'en';
  const settings = data.settings || {};

  // Find the catalogue link and image if they exist in settings, or use fallbacks
  // From old site: exportCatData?.catalog_file, catalog_image, catalog_ar, catalog_en
  const catalogFile = "https://drive.google.com/file/d/1oB1YdeeB4RK1IObDKL4j7aH61Lk9yQqp/view";
  const catalogImage = "/nxt722V09sW2i5Cc6bsw4RBLaCeaSahztSVo2H3g.png";
  const catalogText = (isEn ? settings.catalog_text?.en : settings.catalog_text?.ar) || (isEn ? "Explore Our Products: Discover Orouba's world of premium frozen products meticulously crafted for global markets. Our catalogue offers a diverse range of frozen products and brands to meet your business requirements." : "استكشف منتجاتنا: اكتشف عالم العروبة من المنتجات المجمدة الممتازة المصنوعة بعناية للأسواق العالمية. يقدم الكتالوج الخاص بنا مجموعة متنوعة من المنتجات والعلامات التجارية المجمدة لتلبية متطلبات عملك.");

  return (
    <div className="bg-white min-h-screen pb-20 pt-32" dir={isEn ? "ltr" : "rtl"}>
      
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8">
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl text-orouba-blue ${isEn ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
          <Link href={`/${locale}`} className="hover:text-orouba-yellow transition-colors">{isEn ? 'Home' : 'الرئيسية'}</Link>
          <span className="text-gray-400 mx-1">{'>'}</span>
          <span>{isEn ? 'Export Catalogue' : 'كتالوج التصدير'}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-12">
          
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-orouba-blue mb-4">
              {isEn ? 'Welcome To Export Catalogue' : 'مرحباً بكم في كتالوج التصدير'}
            </h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {catalogText}
            </p>
            <a 
              href={catalogFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#1E4E8C] text-white font-medium px-8 py-2.5 rounded-lg text-sm hover:bg-blue-800 transition-colors shadow-sm text-center"
            >
              {isEn ? 'Download Catalogue' : 'تحميل الكتالوج'}
            </a>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <img 
                src={catalogImage} 
                alt={isEn ? "Orouba Catalog" : "كتالوج العروبة"} 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Collaborate Form */}
        <div className="mt-10 pt-10 border-t border-gray-100">
          <CollaborateForm locale={locale as "ar" | "en"} />
        </div>
      </div>
    </div>
  );
}
