"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ChevronLeft, ArrowUp } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

interface MenuItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon?: string;
  linkUrl?: string;
  parentId?: string | null;
  number: number;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Detect language from HTML dir attribute
  const { locale: lang } = useLocale();

  // Fetch menu items
  useEffect(() => {
    fetch("/api/chat-menu")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {});
  }, []);

  // Show notification on first visit
  useEffect(() => {
    const shown = sessionStorage.getItem("chat_notif_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        sessionStorage.setItem("chat_notif_shown", "1");
      }, 2000);
      const hideTimer = setTimeout(() => setShowNotification(false), 8000);
      return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }
  }, []);

  // Scroll listener — show back-to-top ONLY when scrolling UP
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if at the very top
      if (currentScrollY < 100) {
        setShowBackToTop(false);
      } 
      // If scrolling UP, show the button
      else if (currentScrollY < lastScrollY.current) {
        setShowBackToTop(true);
      } 
      // If scrolling DOWN, hide the button
      else if (currentScrollY > lastScrollY.current) {
        setShowBackToTop(false);
      }

      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveParent(null);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on navigation
  useEffect(() => {
    setIsOpen(false);
    setActiveParent(null);
  }, [pathname]);

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  const topItems = items.filter(i => !i.parentId).sort((a, b) => a.number - b.number);
  const getChildren = (parentId: string) => items.filter(i => i.parentId === parentId).sort((a, b) => a.number - b.number);

  const label = (item: MenuItem) => lang === "en" ? item.labelEn : item.labelAr;

  const welcomeMsg = lang === "en"
    ? "👋 Hello! How can we help you?"
    : "👋 مرحباً! كيف نقدر نساعدك؟";

  const headerTitle = lang === "en" ? "How can we help?" : "كيف نقدر نساعدك؟";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3" ref={panelRef}>

      {/* Notification Bubble */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3.5 max-w-[260px] cursor-pointer relative"
            onClick={() => { setShowNotification(false); setIsOpen(true); }}
          >
            <button onClick={(e) => { e.stopPropagation(); setShowNotification(false); }} className="absolute -top-2 -left-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 hover:bg-gray-300">✕</button>
            <p className="text-sm font-medium text-gray-800">{welcomeMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[340px] max-h-[70vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#1e4a8c] text-white px-5 py-4 flex items-center gap-3">
              {activeParent && (
                <button onClick={() => setActiveParent(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {activeParent
                    ? label(items.find(i => i.id === activeParent)!)
                    : headerTitle}
                </h3>
                {!activeParent && (
                  <p className="text-white/70 text-xs mt-0.5">
                    {lang === "en" ? "Orouba Foods" : "العروبة للصناعات الغذائية"}
                  </p>
                )}
              </div>
              <button onClick={() => { setIsOpen(false); setActiveParent(null); }} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="overflow-y-auto flex-1 py-2">
              <AnimatePresence mode="wait">
                {!activeParent ? (
                  <motion.div key="top" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    {topItems.map((item) => {
                      const children = getChildren(item.id);
                      const hasChildren = children.length > 0;

                      if (hasChildren) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveParent(item.id)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors text-right"
                          >
                            {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
                            <span className="flex-1 font-medium text-gray-800 text-sm">{label(item)}</span>
                            <ChevronLeft className="w-4 h-4 text-gray-400 shrink-0" />
                          </button>
                        );
                      }

                      if (item.linkUrl) {
                        return (
                          <Link
                            key={item.id}
                            href={item.linkUrl.startsWith("http") ? item.linkUrl : `/${lang}${item.linkUrl.startsWith("/") ? "" : "/"}${item.linkUrl}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                          >
                            {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
                            <span className="flex-1 font-medium text-gray-800 text-sm">{label(item)}</span>
                          </Link>
                        );
                      }

                      return (
                        <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 text-gray-500">
                          {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
                          <span className="flex-1 text-sm">{label(item)}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div key="sub" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {getChildren(activeParent).map((child) => (
                      child.linkUrl ? (
                        <Link
                          key={child.id}
                          href={child.linkUrl.startsWith("http") ? child.linkUrl : `/${lang}${child.linkUrl.startsWith("/") ? "" : "/"}${child.linkUrl}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors"
                        >
                          {child.icon && <span className="text-lg shrink-0">{child.icon}</span>}
                          <span className="flex-1 text-sm text-gray-700">{label(child)}</span>
                        </Link>
                      ) : (
                        <div key={child.id} className="px-5 py-3.5 text-sm text-gray-500">
                          {child.icon && <span className="text-lg ml-2">{child.icon}</span>}
                          {label(child)}
                        </div>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons Container for Smooth Swapping */}
      <div className="relative w-14 h-[120px] flex justify-center">
        
        {/* Back to Top Button — Fixed at bottom */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={scrollToTop}
              className="absolute bottom-0 w-12 h-12 bg-white text-[#1e4a8c] rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-colors"
              title={lang === "en" ? "Back to top" : "العودة للأعلى"}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Chat Button — Moves up when back-to-top is visible */}
        <motion.button
          animate={{ y: showBackToTop ? -60 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => { setIsOpen(!isOpen); setShowNotification(false); setActiveParent(null); }}
          className="absolute bottom-0 w-14 h-14 bg-[#1e4a8c] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>

      </div>
    </div>
  );
}
