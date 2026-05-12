"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

/* eslint-disable @next/next/no-img-element */

export default function Navbar({ settings }: { settings?: Record<string, { en?: string; ar?: string }> }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, setLocale } = useLocale();

  const handleLanguageSwitch = (targetLocale: 'en' | 'ar') => {
    setIsLangMenuOpen(false);
    
    if (locale === targetLocale) return;

    setLocale(targetLocale);

    // Replace the first path segment (the locale) with the new locale
    const segments = pathname.split('/');
    if (segments[1] === 'ar' || segments[1] === 'en') {
      segments[1] = targetLocale;
    } else {
      segments.splice(1, 0, targetLocale);
    }
    
    const newPath = segments.join('/');
    const queryString = searchParams?.toString();
    const finalUrl = queryString ? `${newPath}?${queryString}` : newPath;

    router.push(finalUrl);
    router.refresh(); // Refresh RSC payload just to be safe
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/products?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

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
    { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
    { 
      label: locale === "ar" ? "عن العروبة" : "About Orouba", 
      href: `/${locale}/about/whoWeAre`,
      children: [
        { label: locale === "ar" ? "من نحن" : "Who We Are", href: `/${locale}/about/whoWeAre` },
        { label: locale === "ar" ? "الشهادات" : "Certifications", href: `/${locale}/about/certifications` },
        { label: locale === "ar" ? "أصناف المنتجات" : "Product Categories", href: `/${locale}/products` },
      ]
    },
    { 
      label: locale === "ar" ? "المنتجات" : "Products", 
      href: `/${locale}/products`,
      children: [
        { label: locale === "ar" ? "بسمة" : "Basma", href: `/${locale}/brands/5` },
        { label: locale === "ar" ? "بابيتس" : "Babits", href: `/${locale}/brands/8` },
        { label: locale === "ar" ? "فريدة" : "Farida", href: `/${locale}/brands/7` },
      ]
    },
    { label: locale === "ar" ? "التصدير" : "Export", href: `/${locale}/export` },
    { label: locale === "ar" ? "الوصفات" : "Recipes", href: `/${locale}/recipes` },
    { label: locale === "ar" ? "الوظائف" : "Careers", href: `/${locale}/careers` },
    { label: locale === "ar" ? "اتصل بنا" : "Contact Us", href: `/${locale}/contact` },
  ];

  return (
    <nav className="bg-orouba-blue sticky top-0 z-50 text-white shadow-md relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          
          {/* Logo (Right in RTL) */}
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center z-50 h-full relative group">
            <div className="w-auto h-24 md:h-32 absolute top-0 right-0 transform translate-y-2 md:translate-y-4 bg-white rounded-full p-2 shadow-lg border-4 border-[#1e4a8c] group-hover:scale-105 transition-transform duration-300">
              <img 
                src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                alt="Orouba Foods" 
                className="w-full h-full object-contain" 
              />
            </div>
            {/* Placeholder to keep space for the absolute logo */}
            <div className="w-24 md:w-32"></div>
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
                  <div className="absolute top-[140px] right-1/2 translate-x-1/2 w-56 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl rounded-t-3xl z-50">
                    <ul className="flex flex-col py-4 relative z-10">
                      {link.children.map((child, index) => (
                        <li key={index}>
                          <Link 
                            href={child.href}
                            className="block w-full text-center py-4 text-orouba-blue font-bold hover:text-orouba-yellow hover:bg-blue-50 transition-colors rounded-xl mx-2"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {/* Wavy bottom for dropdown */}
                    <div className="absolute top-[99%] left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                      <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-[20px] block">
                        <path fill="white" d="M0,0 Q100,20 200,0 L200,0 L0,0 Z"></path>
                        <path fill="none" stroke="#facc15" strokeWidth="4" d="M0,0 Q100,20 200,0"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Left Actions (Icons + Button + Hamburger) */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Hamburger Menu (Mobile) */}
            <div className="lg:hidden flex items-center border-l border-white/20 pl-3 md:pl-6">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-orouba-yellow p-1 transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Search Icon */}
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 hover:text-orouba-yellow transition-colors"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Dropdown */}
              <div className={`absolute top-[140px] right-1/2 translate-x-1/2 w-72 bg-white shadow-2xl p-4 z-50 transition-all duration-300 rounded-t-3xl ${isSearchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <form onSubmit={handleSearch} className="flex items-center gap-2 relative z-10">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={locale === 'ar' ? "ابحث عن منتج..." : "Search product..."}
                    className="w-full text-black px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orouba-blue text-sm"
                  />
                  <button type="submit" className="bg-orouba-blue text-white p-3 rounded-xl hover:bg-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
                {/* Wavy bottom for dropdown */}
                <div className="absolute top-[99%] left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-[20px] block">
                    <path fill="white" d="M0,0 Q100,20 200,0 L200,0 L0,0 Z"></path>
                    <path fill="none" stroke="#facc15" strokeWidth="4" d="M0,0 Q100,20 200,0"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Globe Icon & Language Dropdown */}
            <div className="relative group flex items-center h-20 md:h-24">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-1 hover:text-orouba-yellow transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <div className={`absolute top-[140px] right-1/2 translate-x-1/2 w-48 bg-white shadow-2xl text-center z-50 rounded-t-3xl transition-all duration-300 ${isLangMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible'}`}>
                <ul className="flex flex-col py-4 relative z-10">
                  <li>
                    <button 
                      onClick={() => handleLanguageSwitch('ar')}
                      className={`block w-full py-3 text-black font-medium hover:text-orouba-yellow hover:bg-gray-50 transition-colors text-lg cursor-pointer ${locale === 'ar' ? 'bg-gray-50 text-orouba-yellow' : ''}`}
                    >
                      العربية
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleLanguageSwitch('en')}
                      className={`block w-full py-3 text-black font-medium hover:text-orouba-yellow hover:bg-gray-50 transition-colors text-lg cursor-pointer ${locale === 'en' ? 'bg-gray-50 text-orouba-yellow' : ''}`}
                    >
                      English
                    </button>
                  </li>
                </ul>
                {/* Wavy bottom for dropdown */}
                <div className="absolute top-[99%] left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="w-full h-[20px] block">
                    <path fill="white" d="M0,0 Q100,20 200,0 L200,0 L0,0 Z"></path>
                    <path fill="none" stroke="#facc15" strokeWidth="4" d="M0,0 Q100,20 200,0"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Export Catalog (Desktop Only) */}
            <Link 
              href={`/${locale}/export-catalog`}
              className="hidden lg:inline-block bg-orouba-yellow text-orouba-blue font-bold px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors shadow-sm whitespace-nowrap"
            >
              {locale === "ar" ? "تحميل الكتالوج" : "Download Catalog"}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Wave at the bottom of the Navbar */}
      <div className="absolute top-[99%] left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px] block">
          {/* Main Blue Background */}
          <path fill="#1e4a8c" d="M0,0 C320,60 420,60 720,30 C1020,0 1120,0 1440,45 L1440,0 L0,0 Z"></path>
          {/* Yellow Wave Stroke */}
          <path fill="none" stroke="#facc15" strokeWidth="8" d="M0,0 C320,60 420,60 720,30 C1020,0 1120,0 1440,45"></path>
          {/* Light Blue / White Wave Stroke */}
          <path fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.5" d="M0,8 C320,68 420,68 720,38 C1020,8 1120,8 1440,53"></path>
        </svg>
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
              <div className="pt-4 flex items-center justify-center gap-4">
                <button 
                  onClick={() => { handleLanguageSwitch('ar'); setIsMenuOpen(false); }}
                  className={`px-5 py-2 rounded-full font-bold text-base transition-colors ${locale === 'ar' ? 'bg-orouba-yellow text-orouba-blue' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  العربية
                </button>
                <button 
                  onClick={() => { handleLanguageSwitch('en'); setIsMenuOpen(false); }}
                  className={`px-5 py-2 rounded-full font-bold text-base transition-colors ${locale === 'en' ? 'bg-orouba-yellow text-orouba-blue' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  English
                </button>
              </div>
              <div className="pt-4">
                <Link
                  href={`/${locale}/export-catalog`}
                  className="block mx-auto max-w-[200px] py-3 text-lg font-bold text-[#1e4a8c] text-center bg-orouba-yellow rounded-full transition-colors shadow-lg"
                >
                  {locale === "ar" ? "تحميل الكتالوج" : "Download Catalog"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
