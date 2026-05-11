import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الجودة والمعايير | Orouba Foods",
  description: "تعرف على التزامنا بالجودة، وشهاداتنا، والمعايير الدولية التي نتبعها في العروبة.",
};

export default async function QualityPage() {
  const data = await getSiteData();
  const { certificates, standards } = data;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-orouba-blue text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-yellow">الجودة والمعايير</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="text-xl text-blue-50 leading-relaxed font-medium">
            التزامنا الراسخ بالجودة يضمن أن كل منتج يصل إلى مائدتك يلبي أعلى المعايير الدولية للسلامة والتميز.
          </p>
        </div>
      </section>

      {/* Certificates */}
      {certificates?.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-orouba-blue mb-4">شهاداتنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">
              نفخر بحصولنا على العديد من الشهادات الدولية التي تؤكد على عمليات مراقبة الجودة الصارمة لدينا.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {certificates.map((cert: any) => (
              <div key={cert.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:shadow-xl transition-shadow group">
                {cert.image ? (
                  <div className="h-40 w-40 mx-auto mb-6 p-4 rounded-full border border-gray-100 group-hover:border-orouba-yellow transition-colors">
                    <img src={cert.image} alt={cert.titleAr || "شهادة الجودة"} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="h-40 w-40 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 group-hover:border-orouba-yellow transition-colors">
                    <span className="text-5xl">📜</span>
                  </div>
                )}
                {cert.titleAr && <h3 className="text-xl font-bold text-orouba-blue mb-2 group-hover:text-blue-800 transition-colors">{cert.titleAr}</h3>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Standards */}
      {standards?.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-orouba-blue mb-4">المعايير الدولية</h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                نلتزم التزاماً تاماً بمعايير التصنيع والسلامة العالمية لضمان تقديم أفضل المنتجات.
              </p>
            </div>
            <div className="space-y-8 max-w-4xl mx-auto">
              {standards.map((std: any) => (
                <div key={std.id} className="flex flex-col md:flex-row gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 items-start hover:shadow-md transition-shadow">
                  {std.image ? (
                    <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl p-3 shadow-sm border border-gray-200">
                      <img src={std.image} alt={std.titleAr || "المعيار"} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl p-3 shadow-sm border border-gray-200 flex items-center justify-center">
                       <span className="text-4xl text-orouba-blue">⭐</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <h3 className="text-2xl font-bold text-orouba-blue mb-3">{std.titleAr || std.titleEn}</h3>
                    <p className="text-gray-600 leading-relaxed">{std.descriptionAr || std.descriptionEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
