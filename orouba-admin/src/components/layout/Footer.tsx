"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* eslint-disable @next/next/no-img-element */

interface FooterProps {
  settings?: Record<string, { en?: string; ar?: string }>;
  socials?: Array<{ id: string; image?: string; link: string; isHidden: boolean }>;
  brands?: Array<{ id: string; nameAr?: string; image?: string }>;
}

export default function Footer({ settings, socials, brands }: FooterProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#1e4a8c] text-white pt-16 mt-20 rounded-t-[40px] relative overflow-hidden">
        {/* Faint Background Shapes */}
        <div className="absolute right-20 top-40 opacity-10 pointer-events-none">
           {/* Pea Pod SVG approximation */}
           <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a3d65c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
             <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8z" strokeDasharray="2 2" />
             <circle cx="9" cy="12" r="1.5" fill="#a3d65c" />
             <circle cx="13" cy="12" r="1.5" fill="#a3d65c" />
             <circle cx="17" cy="12" r="1.5" fill="#a3d65c" />
           </svg>
        </div>
        <div className="absolute right-40 bottom-40 opacity-10 pointer-events-none">
           {/* Vegetable slice approximation */}
           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#a3d65c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
             <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
             <path d="M12 7v10M7 12h10" />
           </svg>
        </div>
        <div className="absolute left-20 bottom-60 opacity-10 pointer-events-none">
           {/* Bean approximation */}
           <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#a3d65c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 4C8 4 4 8 4 12s4 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
             <path d="M9 12c0 1.7 1.3 3 3 3s3-1.3 3-3" />
           </svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
          
          {/* DESKTOP LAYOUT */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12" dir="rtl">
            {/* Column 1: Logo */}
            <div className="flex flex-col items-start lg:items-center justify-start">
              <Link href="/" className="inline-block mt-4">
                <img 
                  src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                  alt="Orouba Foods" 
                  className="w-44 h-44 object-contain" 
                />
              </Link>
            </div>

            {/* Column 2: Our Products */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00] inline-block">منتجاتنا</h3>
              <ul className="space-y-6">
                <li><Link href="/brands/5/ar" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">بسمة</Link></li>
                <li><Link href="/brands/7/ar" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">فريدة</Link></li>
                <li><Link href="/brands/8/ar" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">بابيتس</Link></li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00] inline-block">روابط سريعة</h3>
              <ul className="space-y-6">
                <li><Link href="/about/whoWeAre" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">من نحن</Link></li>
                <li><Link href="/products" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">منتجاتنا</Link></li>
                <li><Link href="/recipes/ar" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">وصفات</Link></li>
                <li><Link href="/careers" className="text-white hover:text-[#ffcc00] transition-colors text-lg font-medium">الوظائف</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="text-right flex flex-col items-end">
              <h3 className="text-xl font-bold mb-8 text-[#ffcc00]">اتصل بنا</h3>
              <ul className="space-y-5 text-white flex flex-col items-end w-full">
                
                <li className="flex items-start gap-3 justify-end w-full">
                  <div className="text-right text-sm leading-relaxed max-w-[200px]">
                    {settings?.address?.ar || "مدينة العبور، بلوك 12008، قسم 5، القاهرة، عرب العبور 43، مصر"}
                  </div>
                  <span className="text-[#ffcc00] mt-1 text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2">
                  <span className="text-sm" dir="ltr">{settings?.phone_1?.en || "+20 22 4489 226"}</span>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2">
                  <span className="text-sm" dir="ltr">{settings?.fax?.en || "+20 22 4489 227"}</span>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </span>
                </li>

                <li className="flex items-center gap-3 justify-end w-full mt-2 mb-6">
                  <a href={`mailto:${settings?.email?.en || "oroubaemail@orouba-ajwa.com"}`} className="text-sm hover:text-[#ffcc00] transition-colors">{settings?.email?.en || "oroubaemail@orouba-ajwa.com"}</a>
                  <span className="text-[#ffcc00] text-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                </li>

                {/* Social Media Links */}
                <li className="flex flex-col gap-3 justify-end w-full mt-4">
                  {brands?.slice(0, 3).map((brand) => (
                    <div key={brand.id} className="flex items-center justify-end gap-3">
                      <div className="flex gap-2">
                        {socials?.filter((s) => !s.isHidden).map((social) => (
                          <a key={social.id} href={social.link} target="_blank" rel="noreferrer" className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
                            {social.image ? <img src={social.image} alt="social" className="w-full h-full object-cover" /> : <span className="text-blue-600 text-xs font-bold">@</span>}
                          </a>
                        ))}
                      </div>
                      <Link href={`/brands/${brand.id}`}>
                        <img src={brand.image || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"} alt={brand.nameAr} className="w-12 h-12 object-contain bg-white rounded-md p-1" />
                      </Link>
                    </div>
                  ))}
                </li>

              </ul>
            </div>
          </div>

          {/* MOBILE ACCORDION LAYOUT */}
          <div className="block md:hidden mb-12" dir="rtl">
            {/* Mobile Logo */}
            <div className="flex justify-start mb-12">
              <Link href="/">
                <img 
                  src="https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png" 
                  alt="Orouba Foods" 
                  className="w-32 h-32 object-contain" 
                />
              </Link>
            </div>

            <div className="space-y-6">
              {/* Products Accordion */}
              <div className="border-b border-blue-800/30 pb-4">
                <button 
                  onClick={() => toggleSection('products')}
                  className="w-full flex items-center justify-end gap-4 text-right"
                >
                  <h3 className="text-3xl font-bold text-[#ffcc00]">منتجاتنا</h3>
                  <motion.svg 
                    animate={{ rotate: openSection === 'products' ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 text-[#ffcc00]" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openSection === 'products' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-4 pt-6 text-right pl-10 pr-2">
                        <li><Link href="/brands/5/ar" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">بسمة</Link></li>
                        <li><Link href="/brands/7/ar" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">فريدة</Link></li>
                        <li><Link href="/brands/8/ar" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">بابيتس</Link></li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Links Accordion */}
              <div className="border-b border-blue-800/30 pb-4">
                <button 
                  onClick={() => toggleSection('links')}
                  className="w-full flex items-center justify-end gap-4 text-right"
                >
                  <h3 className="text-3xl font-bold text-[#ffcc00]">روابط سريعة</h3>
                  <motion.svg 
                    animate={{ rotate: openSection === 'links' ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 text-[#ffcc00]" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openSection === 'links' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-4 pt-6 text-right pl-10 pr-2">
                        <li><Link href="/about/whoWeAre" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">من نحن</Link></li>
                        <li><Link href="/products" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">منتجاتنا</Link></li>
                        <li><Link href="/recipes/ar" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">وصفات</Link></li>
                        <li><Link href="/careers" className="text-white hover:text-[#ffcc00] transition-colors text-xl font-medium">الوظائف</Link></li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Us Accordion */}
              <div className="border-b border-blue-800/30 pb-4">
                <button 
                  onClick={() => toggleSection('contact')}
                  className="w-full flex items-center justify-end gap-4 text-right"
                >
                  <h3 className="text-3xl font-bold text-[#ffcc00]">اتصل بنا</h3>
                  <motion.svg 
                    animate={{ rotate: openSection === 'contact' ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 text-[#ffcc00]" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openSection === 'contact' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-6 pt-6 text-white flex flex-col items-end w-full pl-10">
                        <li className="flex items-start gap-4 justify-end w-full">
                          <div className="text-right text-lg leading-relaxed max-w-[250px]">
                            {settings?.address?.ar || "مدينة العبور، بلوك 12008، قسم 5، القاهرة، عرب العبور 43، مصر"}
                          </div>
                          <span className="text-[#ffcc00] mt-1 text-2xl shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          </span>
                        </li>

                        <li className="flex items-center gap-4 justify-end w-full">
                          <span className="text-lg" dir="ltr">{settings?.phone_1?.en || "+20 22 4489 226"}</span>
                          <span className="text-[#ffcc00] text-2xl shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </span>
                        </li>

                        <li className="flex items-center gap-4 justify-end w-full">
                          <span className="text-lg" dir="ltr">{settings?.fax?.en || "+20 22 4489 227"}</span>
                          <span className="text-[#ffcc00] text-2xl shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          </span>
                        </li>

                        <li className="flex items-center gap-4 justify-end w-full mb-6">
                          <a href={`mailto:${settings?.email?.en || "oroubaemail@orouba-ajwa.com"}`} className="text-lg hover:text-[#ffcc00] transition-colors">{settings?.email?.en || "oroubaemail@orouba-ajwa.com"}</a>
                          <span className="text-[#ffcc00] text-2xl shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </span>
                        </li>

                        {/* Social Media Links for Mobile */}
                        <li className="flex flex-col gap-4 justify-end w-full mt-4">
                          {brands?.slice(0, 3).map((brand) => (
                            <div key={brand.id} className="flex items-center justify-end gap-4">
                              <div className="flex gap-2">
                                {socials?.filter((s) => !s.isHidden).map((social) => (
                                  <a key={social.id} href={social.link} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
                                    {social.image ? <img src={social.image} alt="social" className="w-full h-full object-cover" /> : <span className="text-blue-600 text-sm font-bold">@</span>}
                                  </a>
                                ))}
                              </div>
                              <Link href={`/brands/${brand.id}`}>
                                <img src={brand.image || "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"} alt={brand.nameAr} className="w-14 h-14 object-contain bg-white rounded-md p-1" />
                              </Link>
                            </div>
                          ))}
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="border-t border-[#2a68a8] pt-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-base md:text-lg font-medium text-center order-2 md:order-1">
              جميع الحقوق محفوظة لدى © 2026 العروبة.
            </div>
            <div className="text-white text-base md:text-lg font-medium text-center order-1 md:order-2">
              تم التطوير بواسطة <a href="https://valueims.com" target="_blank" rel="noopener noreferrer" className="text-[#ffcc00] hover:underline font-bold">ValueIMS</a>
            </div>
          </div>
        </div>
      </footer>
  );
}
