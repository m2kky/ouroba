import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن | Orouba Foods",
  description: "تعرف على تاريخ العروبة للصناعات الغذائية، قيمنا، ومعايير الجودة.",
};

export default async function AboutPage() {
  const data = await getSiteData();
  const { settings, values, buildings, productionSteps } = data;

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* 1. Hero / Header */}
      <section className="py-24 bg-orouba-blue text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-orouba-yellow">من نحن</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="text-xl text-blue-50 leading-relaxed font-medium">
            تعرف على رحلتنا، رؤيتنا، ولماذا تعتبر العروبة خيارك الأول في عالم الصناعات الغذائية.
          </p>
        </div>
      </section>

      {/* 2. From Vision to Reality */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2 order-2 md:order-1 relative">
             <img src="https://camp-coding.site/eloroba/storage/app/images/ZHVQeLXeXFxqfGf27Yd4yiETR1EmFh2Tij1rUudu.png" alt="Orouba Products" className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-8 leading-tight">من الرؤية إلى الواقع</h2>
            <p className="text-lg text-gray-600 leading-loose mb-10 text-justify">
              تأسست شركة العروبة لصناعة المواد الغذائية سنة ١٩٩٨، برؤية تهدف للتمييز فى انتاج و ابتكار منتجات غذائية مجمدة عالية الجودة وسريعة الطهى لجميع انحاء العالم. تبلغ مساحة المصنع ٢٠,٠٠٠ متر مربع، وهو مجهز بأحدث التقنيات، تحت إشراف وإدارة فريق من المهندسين والعامليين ذوى الخبرة والكفاءة العالية لضمان انتاج عالى الجودة وفقا للمعايير الدولية. حرصا منا على إرضاء عملائنا والحفاظ على ثقتهم، فإننا نقدم مجموعة كبيرة ومتنوعة من المنتجات الطازجة المجمدة من خضروات، فواكة، بقوليات، حبوب وأيضا فلافل ومنتجات نصف مقلية مجمدة يتم إنتاجها جميعا من مكونات طبيعية دون أى اضافات.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
        <div className="absolute -right-20 top-20 w-64 h-64 bg-orouba-blue opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-4">لماذا العروبة ؟</h2>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">اكتشف الفرق في كل قضمة:</h3>
            <p className="text-xl text-gray-600 leading-loose mb-10 text-justify">
              يعد اختيار العروبة هو اختيار التميز والسهولة ومتعة الطهي وذلك لإلتزامنا بالمعايير الدولية وشغفنا بالابتكار. تلبي منتجاتنا الطبيعية واللذيذة أذواقًا متنوعة، و تجعل إعداد الطعام أكثر سهولة ومتعة. ثق في العروبة لتحويل الوجبات العادية إلى تجارب غير تقليدية وإضفاء البهجة على مطبخك ومائدتك. انضم إلينا واكتشف متعة الطهي مع العروبة!!.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
             <div className="absolute -bottom-10 -right-10 w-full h-full bg-orouba-yellow rounded-[3rem] opacity-20 -z-10 transition-transform duration-500 hover:rotate-2"></div>
             <img src="https://camp-coding.site/eloroba/storage/app/images/wAyRPeQNWO2V0bTsRk8tDHD2NxsesoXWWSXjqHi5.png" alt="Plates" className="w-full h-[500px] object-contain rounded-[3rem] hover:-translate-y-2 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* 4. Our Values */}
      {values?.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-4xl font-bold text-center mb-16 text-orouba-blue">قيمنا الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value: any) => (
                <div key={value.id} className="p-10 border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white text-center group">
                  {value.image ? (
                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors">
                      <img src={value.image} alt={value.titleAr} className="w-14 h-14 object-contain" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-8 text-4xl text-orouba-blue">
                      🌟
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-orouba-blue mb-4">{value.titleAr}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.descriptionAr}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Our Facilities (Buildings) */}
      {buildings?.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-4xl font-bold text-center mb-16 text-orouba-blue">منشآتنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {buildings.map((building: any) => (
                <div key={building.id} className="bg-white rounded-[2rem] overflow-hidden shadow-md flex flex-col group hover:shadow-xl transition-shadow">
                  {building.image && (
                    <div className="h-80 relative overflow-hidden bg-gray-200">
                      <img src={building.image} alt={building.titleAr} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-10 flex-grow">
                    <h3 className="text-3xl font-bold text-orouba-blue mb-4 group-hover:text-orouba-yellow transition-colors">{building.titleAr}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{building.descriptionAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Production Steps */}
      {productionSteps?.length > 0 && (
        <section className="py-24 bg-orouba-blue text-white mt-12">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-4xl font-bold text-center mb-20 text-orouba-yellow">مراحل الإنتاج</h2>
            <div className="space-y-20 relative">
              <div className="absolute top-0 bottom-0 right-1/2 w-1 bg-blue-800 hidden md:block rounded-full"></div>
              {productionSteps.map((step: any, index: number) => (
                <div key={step.id} className={`flex flex-col md:flex-row gap-16 items-center relative z-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:flex absolute right-1/2 translate-x-1/2 w-12 h-12 bg-orouba-yellow text-orouba-blue font-bold text-xl rounded-full items-center justify-center border-4 border-orouba-blue z-20">
                    {step.number}
                  </div>
                  
                  {step.image && (
                    <div className="w-full md:w-1/2 h-96 relative rounded-[2rem] overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-orouba-blue/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img src={step.image} alt={`Step ${step.number}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className={`w-full ${step.image ? 'md:w-1/2' : ''} bg-white/10 p-10 rounded-[2rem] backdrop-blur-sm border border-white/10`}>
                    <div className="text-orouba-yellow font-bold text-2xl mb-4 md:hidden">الخطوة {step.number}</div>
                    <p className="text-2xl text-white leading-relaxed font-medium">{step.textAr}</p>
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
