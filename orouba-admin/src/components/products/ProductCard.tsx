"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LogoLoader from "@/components/ui/LogoLoader";

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
  const hoverColor = brand.hoverColor || "#facc15"; // Fallback color
  const productName = locale === "ar" ? product.nameAr : product.nameEn;

  // Calculate if the hover color is light or dark to determine text color
  const isLightColor = (hex: string) => {
    if (!hex || !hex.startsWith("#")) return true;
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 160;
  };
  
  const hoverTextColor = isLightColor(hoverColor) ? "#1e4a8c" : "#ffffff";

  return (
    <Link href={`/${locale}/products/details/${product.id}`}>
      <motion.div
        className="relative flex flex-col items-center justify-between rounded-[2.5rem] overflow-hidden cursor-pointer w-full max-w-[300px] mx-auto h-[380px] shadow-sm hover:shadow-2xl transition-all duration-500 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: isHovered ? hoverColor : "#f4f6f8" }}
      >
        {/* Product Image */}
        <div className="relative z-10 w-full flex-grow flex items-center justify-center p-6 pb-2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 mt-4">
          {product.images?.[0]?.url ? (
            <Image
              src={(product.images[0].url.startsWith("http") || product.images[0].url.startsWith("/")) ? product.images[0].url : `https://camp-coding.site/eloroba/${product.images[0].url}`}
              alt={productName}
              width={250}
              height={250}
              className="object-contain h-[200px] w-auto drop-shadow-xl"
              unoptimized
            />
          ) : (
            <LogoLoader size="sm" transparent />
          )}
        </div>

        {/* Details Bottom Section */}
        <div 
          className="relative z-10 w-full transition-all duration-500 pt-6 pb-6 px-6 flex flex-col items-center text-center mt-auto"
          style={{ 
             backgroundColor: isHovered ? "transparent" : "#ffffff",
             borderTopLeftRadius: isHovered ? "0" : "2.5rem",
             borderTopRightRadius: isHovered ? "0" : "2.5rem"
          }}
        >
          <h4
            className="text-xl font-bold mb-3 transition-colors duration-500"
            style={{ color: isHovered ? hoverTextColor : "#1e4a8c" }}
          >
            {productName}
          </h4>
          <div 
            className="flex items-center gap-2 font-bold text-base transition-colors duration-500"
            style={{ color: isHovered ? hoverTextColor : "#6b7280" }}
          >
            <span>{locale === "ar" ? "المزيد" : "Learn More"}</span>
            <ArrowLeft
              className={`w-5 h-5 transition-transform duration-500 ${
                locale === "ar" ? "rotate-0 group-hover:-translate-x-2" : "rotate-180 group-hover:translate-x-2"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
