"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  images: { url: string }[];
}

interface RelatedProductsSliderProps {
  products: Product[];
  brand: {
    id: string;
    hoverColor?: string | null;
  };
  locale: "ar" | "en";
}

export default function RelatedProductsSlider({ products, brand, locale }: RelatedProductsSliderProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mt-16 mb-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
        <h2 className="text-3xl md:text-4xl font-bold text-orouba-blue">
          {locale === "ar" ? "منتجات ذات صلة" : "Related Products"}
        </h2>
      </div>

      <div className="w-full overflow-hidden relative">
        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex overflow-x-auto gap-6 px-4 md:px-8 pb-10 pt-4 snap-x snap-mandatory hide-scrollbar max-w-[1400px] mx-auto">
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[300px] snap-center">
              <ProductCard product={product} brand={brand} locale={locale} />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
