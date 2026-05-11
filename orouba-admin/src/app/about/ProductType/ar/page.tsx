import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أصناف المنتجات | Orouba Foods",
  description: "اكتشف مجموعة أصناف المنتجات التي نقدمها في العروبة للصناعات الغذائية.",
};

export default async function ProductTypesPage() {
  const data = await getSiteData();
  const { categoryTypes } = data;

  return (
    <div className="bg-gray-50 min-h-screen py-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-6">أصناف المنتجات</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            نقدم في العروبة مجموعة متنوعة من الأصناف التي تُلبي كافة احتياجاتك اليومية بأعلى معايير الجودة العالمية.
          </p>
        </div>

        {categoryTypes && categoryTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categoryTypes.map((type: any) => (
              <div
                key={type.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
              >
                <div className="h-64 w-full relative overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                  {type.image ? (
                    <img
                      src={type.image}
                      alt={type.titleAr}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl text-orouba-blue font-bold opacity-20">صنف</span>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h2 className="text-3xl font-bold text-center mb-4 text-orouba-blue group-hover:text-orouba-yellow transition-colors">
                    {type.titleAr}
                  </h2>
                  <p className="text-gray-600 text-center flex-grow leading-relaxed">
                    {type.descriptionAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xl font-bold">لا توجد أصناف متاحة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
