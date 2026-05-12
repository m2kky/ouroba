"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* eslint-disable @next/next/no-img-element */

export default function Navbar({ settings }: { settings?: Record<string, { en?: string; ar?: string }> }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { 
      label: "عن العروبة", 
      href: "/about/whoWeAre",
      children: [
        { label: "من نحن", href: "/about/whoWeAre" },
        { label: "الشهادات", href: "/about/certifications/ar" },
        { label: "أصناف المنتجات", href: "/products" },
      ]
    },
    { 
      label: "المنتجات", 
      href: "/products",
      children: [
        { label: "بسمة", href: "/brands/5/ar" },
        { label: "بابيتس", href: "/brands/8/ar" },
        { label: "فريدة", href: "/brands/7/ar" },
      ]
    },
    { label: "التصدير", href: "/export" },
    { label: "الوصفات", href: "/recipes/ar" },
    { label: "الوظائف", href: "/careers" },
    { label: "اتصل بنا", href: "/contact" },
  ];

  return (
    <nav className={`bg-orouba-blue sticky top-0 z-50 text-white shadow-md transition-[border-radius] duration-300 ${isMenuOpen ? "rounded-b-none" : "rounded-b-[2rem]"}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center z-50">
            <div className="w-auto h-20 relative">
              <img 
                src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                alt="Orouba Foods" 
                className="w-full h-full object-contain" 
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-[16px] h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group h-full flex items-center">
                <Link 
                  href={link.href} 
                  className={`hover:text-orouba-yellow transition-colors duration-200 py-8 ${
                    pathname === link.href ? "text-orouba-yellow" : ""
                  }`}
                >
                  {link.label}
                </Link>

                {/* Dropdown Menu */}
                {link.children && link.children.length > 0 && (
                  <div className="absolute top-24 right-1/2 translate-x-1/2 w-48 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl rounded-b-2xl border-t-2 border-orouba-yellow overflow-hidden">
                    <ul className="flex flex-col py-2">
                      {link.children.map((child, index) => (
                        <li key={index}>
                          <Link 
                            href={child.href}
                            className="block w-full text-center py-4 text-orouba-blue font-bold hover:text-orouba-yellow hover:bg-blue-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Left Actions (Icons + Button) */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 hover:text-orouba-yellow transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:text-orouba-yellow transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <Link 
              href="/export-catalog" 
              className="bg-orouba-yellow text-orouba-blue font-bold px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors shadow-sm whitespace-nowrap"
            >
              تحميل الكتالوج
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - flows inside nav as natural extension */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-6 pt-4 pb-10 space-y-2">
              {navLinks.map((link) => (
                <div key={link.label} className="text-center">
                  {link.children && link.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => setOpenAccordion(openAccordion === link.label ? null : link.label)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-[18px] font-bold text-white transition-colors"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${openAccordion === link.label ? "-rotate-90" : ""}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                        {link.label}
                      </button>
                      
                      <AnimatePresence>
                        {openAccordion === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 py-3">
                              {link.children.map((child, index) => (
                                <Link
                                  key={index}
                                  href={child.href}
                                  className="block py-2 text-base font-bold text-white/80 hover:text-orouba-yellow transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="block py-3 text-[18px] font-bold text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6">
                <a 
                  href={settings?.catalogFileUrl?.ar || "#"} 
                  className="block mx-auto max-w-[200px] py-3 text-lg font-bold text-[#1e4a8c] text-center bg-orouba-yellow rounded-full transition-colors shadow-lg"
                >
                  تحميل الكتالوج
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
