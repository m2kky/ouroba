"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ settings, brands }: { settings?: any; brands?: any[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
    <nav className="bg-orouba-blue sticky top-0 z-50 text-white shadow-md rounded-b-[2rem] pb-2 -mb-8">
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
            
            {/* Search Icon */}
            <button className="p-2 hover:text-orouba-yellow transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Language Icon */}
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
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-orouba-blue border-t border-blue-800 rounded-b-[2rem] overflow-hidden">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link 
                  href={link.href} 
                  className="block px-3 py-2 text-base font-bold hover:bg-blue-800 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && link.children.length > 0 && (
                  <div className="pr-6 space-y-1 mt-1 border-r-2 border-orouba-yellow">
                    {link.children.map((child, index) => (
                      <Link
                        key={index}
                        href={child.href}
                        className="block px-3 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 mt-2 border-t border-blue-800">
              <a 
                href={settings?.catalogFileUrl || "#"} 
                className="block px-3 py-2 text-base font-bold text-orouba-yellow text-center bg-blue-900 rounded-full"
              >
                تحميل الكتالوج
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
