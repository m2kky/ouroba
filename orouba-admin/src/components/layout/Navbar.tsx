"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

/* eslint-disable @next/next/no-img-element */

export default function Navbar({ settings, brands: brandsProp }: { settings?: Record<string, { en?: string; ar?: string }>; brands?: any[] }) {
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
      window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Build brand children dynamically from actual database data
  const brandChildren = (brandsProp || []).slice(0, 5).map((brand: any) => {
    const brandName = locale === 'ar' ? brand.nameAr : (brand.nameEn || brand.nameAr);
    const slugName = (brand.nameEn || brand.nameAr || 'brand').replace(/\s+/g, '-');
    return {
      label: brandName,
      href: `/${locale}/brands/${slugName}/${brand.id}`,
    };
  });

  const navLinks = [
    { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
    { 
      label: locale === "ar" ? "عن العروبة" : "About Orouba", 
      href: `/${locale}/about/whoWeAre`,
      children: [
        { label: locale === "ar" ? "من نحن" : "Who We Are", href: `/${locale}/about/whoWeAre` },
        { label: locale === "ar" ? "الشهادات" : "Certifications", href: `/${locale}/about/certifications` },
        { label: locale === "ar" ? "أصناف المنتجات" : "Product Categories", href: `/${locale}/about/ProductType` },
      ]
    },
    { 
      label: locale === "ar" ? "المنتجات" : "Brands", 
      href: `#`,
      children: brandChildren.length > 0 ? brandChildren : [
        { label: locale === "ar" ? "عرض الكل" : "View All", href: `/${locale}/brands` },
      ]
    },
    { label: locale === "ar" ? "التصدير" : "Export", href: `/${locale}/export` },
    { label: locale === "ar" ? "الوصفات" : "Recipes", href: `/${locale}/recipes` },
    { label: locale === "ar" ? "اتصل بنا" : "Contact Us", href: `/${locale}/contact` },
    { label: locale === "ar" ? "وظائف" : "Careers", href: `/${locale}/careers` },
  ];

  const mainLogo = settings?.main_logo?.en || settings?.main_logo?.ar || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";

  return (
    <nav className="bg-orouba-blue sticky top-0 z-50 text-white shadow-md relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-28 md:h-24">
          
          {/* Logo (Right in RTL) */}
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center z-50 h-full relative group">
            <div className="w-auto h-24 md:h-32 absolute top-0 right-0 transform translate-y-2 md:translate-y-4 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={mainLogo} 
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
                {link.href === "#" ? (
                  <span 
                    className={`hover:text-orouba-yellow transition-colors duration-200 py-8 cursor-default ${
                      pathname === link.href ? "text-orouba-yellow" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                ) : (
                  <Link 
                    href={link.href} 
                    className={`hover:text-orouba-yellow transition-colors duration-200 py-8 ${
                      pathname === link.href ? "text-orouba-yellow" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.children && link.children.length > 0 && (
                  <div className="absolute top-full right-1/2 translate-x-1/2 pt-6 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-gray-100">
                      <ul className="flex flex-col relative z-10">
                        {link.children.map((child, index) => (
                          <li key={index}>
                            <Link 
                              href={child.href}
                              className={`block w-full text-center py-3 px-4 font-bold hover:text-orouba-blue hover:bg-blue-50 transition-colors ${
                                pathname === child.href ? "text-orouba-blue bg-blue-50" : "text-gray-700"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
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
              <div className={`absolute top-full right-0 pt-6 w-72 md:w-80 z-50 transition-all duration-300 md:translate-x-1/4 ${isSearchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden p-4 border border-gray-100">
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
                </div>
              </div>
            </div>
            
            {/* Globe Icon & Language Dropdown */}
            <div className="relative group flex items-center h-28 md:h-24">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-1 hover:text-orouba-yellow transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <div className={`absolute top-full right-0 pt-6 w-48 text-center z-50 transition-all duration-300 ${isLangMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-0'}`}>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-gray-100">
                  <ul className="flex flex-col relative z-10">
                    <li>
                      <button 
                        onClick={() => handleLanguageSwitch('ar')}
                        className={`block w-full py-3 px-4 text-gray-700 font-bold hover:text-orouba-blue hover:bg-gray-50 transition-colors text-lg cursor-pointer ${locale === 'ar' ? 'bg-gray-50 text-orouba-blue' : ''}`}
                      >
                        العربية
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLanguageSwitch('en')}
                        className={`block w-full py-3 px-4 text-gray-700 font-bold hover:text-orouba-blue hover:bg-gray-50 transition-colors text-lg cursor-pointer ${locale === 'en' ? 'bg-gray-50 text-orouba-blue' : ''}`}
                      >
                        English
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Catalog (Desktop Only) */}
            <Link 
              href={`/${locale}/export-catalog`}
              className="hidden lg:inline-block bg-white text-orouba-blue font-bold px-6 py-2 rounded-full hover:bg-orouba-dark hover:text-white transition-colors shadow-sm whitespace-nowrap"
            >
              {locale === "ar" ? "تحميل الكتالوج" : "Download Catalog"}
            </Link>
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
                  className="block mx-auto max-w-[200px] py-3 text-lg font-bold text-orouba-blue text-center bg-white rounded-full hover:bg-orouba-dark hover:text-white transition-colors shadow-lg"
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
