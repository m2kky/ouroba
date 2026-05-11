import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import CollaborateForm from "@/components/export/CollaborateForm";

export const metadata: Metadata = {
  title: "العروبة حول العالم | Orouba Foods",
  description: "تقوم شركة العروبة للصناعات الغذائية بتصدير منتجاتها الفاخرة عالمياً عبر عدة قارات.",
};

export default async function ExportPage() {
  const data = await getSiteData();
  const { continents } = data;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-orouba-blue text-white text-center relative overflow-hidden">
        {/* Placeholder world map background */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-yellow">العروبة حول العالم</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="text-xl text-blue-50 leading-relaxed font-medium">
            تلتزم العروبة بتوسيع نطاق انتشارها عالميًا، حيث توفر منتجاتها عالية الجودة لمختلف موائد العالم. 
            تضمن شبكتنا الواسعة إيصال منتجاتنا طوال العام لأكثر من ٥٠ دولة حول العالم.
          </p>
        </div>
      </section>

      {/* World Map Section (as requested in homepage but expanded here) */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <div className="relative w-full h-[400px] bg-white rounded-3xl p-8">
            <img 
              src="https://camp-coding.site/eloroba/storage/app/images/9GWFp84wGE40aoJaGczEwt15qAjnjKtjAlQvqKNz.jpg"
              alt="خريطة العالم للعروبة" 
              className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Continents & Countries */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-orouba-blue mb-4">شبكة التصدير العالمية</h2>
          <p className="text-gray-600">نفخر بتواجدنا في الدول التالية عبر مختلف القارات</p>
        </div>
        
        {continents?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {continents.map((continent: any) => (
              <div key={continent.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-orouba-blue px-6 py-5">
                  <h2 className="text-2xl font-bold text-orouba-yellow flex items-center gap-3">
                    <span>🌍</span>
                    {continent.nameAr}
                  </h2>
                </div>
                <div className="p-8">
                  {continent.countries?.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-y-4 gap-x-6">
                      {continent.countries.map((country: any) => (
                        <li key={country.id} className="flex items-center gap-3 text-gray-700 font-medium hover:text-orouba-blue transition-colors cursor-default">
                          <span className="w-2 h-2 rounded-full bg-orouba-yellow flex-shrink-0 shadow-sm" />
                          <span>{country.nameAr}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm text-center">جاري تحديث بيانات الدول.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">جاري تحديث بيانات التصدير حالياً.</p>
          </div>
        )}
      </section>
      {/* Collaborate Form */}
      <section className="py-12 bg-gray-50 relative px-4 md:px-8">
        <CollaborateForm locale="ar" />
      </section>
    </div>
  );
}
