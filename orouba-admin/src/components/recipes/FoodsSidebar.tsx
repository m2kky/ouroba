"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Food {
  id: string;
  nameAr: string | null;
  nameEn: string | null;
}

interface FoodsSidebarProps {
  foods: Food[];
  activeCategoryId: string;
  activeFoodId: string;
  activeCategoryName: string;
  locale: "ar" | "en";
}

export default function FoodsSidebar({
  foods,
  activeCategoryId,
  activeFoodId,
  activeCategoryName,
  locale,
}: FoodsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFoodName =
    foods.find((f) => f.id === activeFoodId)?.[locale === "ar" ? "nameAr" : "nameEn"] ||
    activeCategoryName;

  return (
    <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
      {/* Mobile Accordion Toggle */}
      <div 
        className="md:hidden flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-orouba-blue text-lg">{activeFoodName}</h3>
        <ChevronDown 
          className={`w-5 h-5 text-orouba-blue transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} 
        />
      </div>

      {/* Desktop List / Mobile Dropdown */}
      <div className={`md:block ${isOpen ? "block" : "hidden"}`}>
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col gap-1 h-auto md:max-h-[600px] overflow-y-auto hide-scrollbar">
          {foods.map((food) => {
            const isActive = food.id === activeFoodId;
            const foodName = locale === "ar" ? food.nameAr : food.nameEn;

            return (
              <Link 
                key={food.id} 
                href={`/${locale}/recipes?c=${activeCategoryId}&f=${food.id}`}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-orouba-blue text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-orouba-blue"
                  }`}
                  whileHover={!isActive ? { x: locale === "ar" ? -5 : 5 } : {}}
                >
                  {foodName}
                </motion.div>
              </Link>
            );
          })}
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
