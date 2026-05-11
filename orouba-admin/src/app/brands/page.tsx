import Link from "next/link";
import { getSiteData } from "@/lib/api-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "منتجاتنا | Orouba Foods",
  description: "استكشف علاماتنا التجارية الرائدة ومجموعة منتجاتنا الواسعة.",
};

export default async function BrandsIndexPage() {
  const data = await getSiteData();
  const { brands } = data;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-orouba-blue mb-6">علاماتنا التجارية</h1>
          <div className="w-24 h-1 bg-orouba-yellow mx-auto rounded-full mb-8" />
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            اكتشف علاماتنا التجارية الموثوقة، حيث نكرس كل منها لتقديم خطوط منتجات غذائية محددة وعالية الجودة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand: any) => (
            <div
              key={brand.id}
              className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
            >
              <div className="h-48 w-48 mx-auto mb-8 relative overflow-hidden rounded-full flex items-center justify-center p-6">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.nameAr}
                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-5xl text-orouba-blue font-bold">{brand.nameAr}</span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-center mb-4 text-orouba-blue">
                {brand.nameAr}
              </h2>
              <p className="text-gray-600 mb-8 text-center flex-grow leading-relaxed">
                {brand.descriptionAr}
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-6 text-sm text-gray-500 font-medium">
                  <span>{brand.categories?.length || 0} فئات</span>
                  <span>
                    {brand.categories?.reduce((acc: number, cat: any) => acc + (cat.products?.length || 0), 0)} منتجات
                  </span>
                </div>
                <Link
                  href={`/brands/${brand.id}`}
                  className="block w-full text-center py-4 rounded-full font-bold transition-colors bg-orouba-yellow text-orouba-blue hover:bg-yellow-400 shadow-sm"
                >
                  تصفح المنتجات
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
