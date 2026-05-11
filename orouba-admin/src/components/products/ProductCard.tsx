"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    nameAr: string;
    nameEn: string;
    images: { url: string }[];
  };
  brand: {
    id: string;
    hoverColor?: string | null;
  };
  locale: "ar" | "en";
}

export default function ProductCard({ product, brand, locale }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverColor = brand.hoverColor || "#005097"; // Fallback color
  const productName = locale === "ar" ? product.nameAr : product.nameEn;

  return (
    <Link href={`/products/details/${product.id}/${locale}`}>
      <motion.div
        className="relative flex flex-col items-center justify-between bg-white rounded-3xl overflow-hidden cursor-pointer w-full max-w-[300px] mx-auto h-[350px] shadow-sm transition-shadow duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Hover Element */}
        <div
          className="absolute inset-0 transition-colors duration-300 z-0"
          style={{ backgroundColor: isHovered ? hoverColor : "transparent" }}
        />

        {/* Product Image */}
        <div className="relative z-10 w-full flex-grow flex items-center justify-center p-6 pb-0 transition-transform duration-300 group-hover:-translate-y-2">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url.startsWith("http") ? product.images[0].url : `https://camp-coding.site/eloroba/${product.images[0].url}`}
              alt={productName}
              width={200}
              height={200}
              className="object-contain h-[180px] w-auto drop-shadow-md"
              unoptimized
            />
          ) : (
            <div className="h-[180px] w-[180px] bg-white/50 rounded-full flex items-center justify-center p-4">
              <Image 
                src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                alt="Orouba" 
                width={120} 
                height={120} 
                className="opacity-50 grayscale object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Details Bottom Section */}
        <div className="relative z-10 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-3xl pt-5 pb-4 px-6 flex flex-col items-center text-center transition-all duration-300 group-hover:bg-opacity-100">
          <h4
            className="text-lg font-bold mb-3 transition-colors duration-300"
            style={{ color: isHovered ? hoverColor : "#333" }}
          >
            {productName}
          </h4>
          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm group-hover:text-black transition-colors duration-300">
            <span>{locale === "ar" ? "المزيد" : "Learn More"}</span>
            <ArrowLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                locale === "ar" ? "rotate-0 group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
