"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";

/* eslint-disable @next/next/no-img-element */

interface PopupButton {
  id: string;
  textAr: string;
  textEn: string;
  bgColor: string;
  textColor: string;
  actionType: string;
  actionValue?: string;
  sequencePopupId?: string;
}

interface PopupConditions {
  maxDisplays?: number;
  cooldownDays?: number;
  deviceType?: string;
  pages?: string[];
}

interface PopupData {
  id: string;
  titleAr?: string;
  titleEn?: string;
  contentAr?: string;
  contentEn?: string;
  image?: string;
  type: string;
  animation: string;
  backgroundColor: string;
  textColor: string;
  overlayColor: string;
  borderRadius: number;
  maxWidth: number;
  buttons?: PopupButton[];
  trigger: string;
  triggerValue: number;
  conditions?: PopupConditions;
}

const anims: Record<string, object> = {
  FADE: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  ZOOM: { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.7 } },
  SLIDE_UP: { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 80 } },
  BOUNCE: { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 12 } }, exit: { opacity: 0, scale: 0.3 } },
};

function getStorageKey(id: string) { return `popup_${id}`; }

function shouldShow(popup: PopupData): boolean {
  const cond = popup.conditions as PopupConditions | undefined;
  if (!cond) return true;

  // Device check
  if (cond.deviceType === "MOBILE" && window.innerWidth > 768) return false;
  if (cond.deviceType === "DESKTOP" && window.innerWidth <= 768) return false;

  // Max displays
  if (cond.maxDisplays && cond.maxDisplays > 0) {
    const count = parseInt(localStorage.getItem(getStorageKey(popup.id) + "_count") || "0", 10);
    if (count >= cond.maxDisplays) return false;
  }

  // Cooldown
  if (cond.cooldownDays && cond.cooldownDays > 0) {
    const lastClosed = localStorage.getItem(getStorageKey(popup.id) + "_closed");
    if (lastClosed) {
      const diff = (Date.now() - parseInt(lastClosed, 10)) / (1000 * 60 * 60 * 24);
      if (diff < cond.cooldownDays) return false;
    }
  }

  return true;
}

function matchesPage(popup: PopupData, pathname: string): boolean {
  const cond = popup.conditions as PopupConditions | undefined;
  if (!cond?.pages || cond.pages.length === 0) return true;
  return cond.pages.some(p => pathname === p || pathname.startsWith(p + "/"));
}

function recordDisplay(id: string) {
  const key = getStorageKey(id) + "_count";
  const count = parseInt(localStorage.getItem(key) || "0", 10);
  localStorage.setItem(key, (count + 1).toString());
}

function recordClose(id: string) {
  localStorage.setItem(getStorageKey(id) + "_closed", Date.now().toString());
}

export default function GlobalPopupManager() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const [allPopups, setAllPopups] = useState<PopupData[]>([]);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/popups").then(r => r.json()).then(d => { if (Array.isArray(d)) setAllPopups(d); }).catch(() => {});
  }, []);

  const showPopup = useCallback((popup: PopupData) => {
    if (!shouldShow(popup) || !matchesPage(popup, pathname)) return;
    setActivePopupId(popup.id);
    recordDisplay(popup.id);
  }, [pathname]);

  // Register triggers
  useEffect(() => {
    if (allPopups.length === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const handlers: Array<{ event: string; fn: EventListener }> = [];

    allPopups.forEach(popup => {
      if (popup.trigger === "SEQUENCE_ONLY") return;
      if (!matchesPage(popup, pathname) || !shouldShow(popup)) return;

      if (popup.trigger === "ON_LOAD") {
        timers.push(setTimeout(() => showPopup(popup), 300));
      } else if (popup.trigger === "TIME_DELAY") {
        timers.push(setTimeout(() => showPopup(popup), popup.triggerValue || 3000));
      } else if (popup.trigger === "ON_SCROLL") {
        const fn = () => {
          const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (pct >= (popup.triggerValue || 50)) { showPopup(popup); window.removeEventListener("scroll", fn); }
        };
        window.addEventListener("scroll", fn, { passive: true });
        handlers.push({ event: "scroll", fn });
      } else if (popup.trigger === "EXIT_INTENT") {
        const fn = (e: Event) => {
          if ((e as MouseEvent).clientY <= 0) { showPopup(popup); document.removeEventListener("mouseout", fn); }
        };
        document.addEventListener("mouseout", fn);
        handlers.push({ event: "mouseout", fn });
      }
    });

    return () => {
      timers.forEach(clearTimeout);
      handlers.forEach(h => {
        if (h.event === "scroll") window.removeEventListener(h.event, h.fn);
        else document.removeEventListener(h.event, h.fn);
      });
    };
  }, [allPopups, pathname, showPopup]);

  const close = () => {
    if (activePopupId) recordClose(activePopupId);
    setActivePopupId(null);
  };

  const handleButtonClick = (btn: PopupButton) => {
    if (btn.actionType === "CLOSE") { close(); }
    else if (btn.actionType === "LINK" && btn.actionValue) { window.open(btn.actionValue, "_blank"); close(); }
    else if (btn.actionType === "NEXT_POPUP" && btn.sequencePopupId) {
      close();
      setTimeout(() => {
        const next = allPopups.find(p => p.id === btn.sequencePopupId);
        if (next) { setActivePopupId(next.id); recordDisplay(next.id); }
      }, 200);
    }
  };

  const popup = allPopups.find(p => p.id === activePopupId);
  if (!popup) return null;

  const anim = anims[popup.animation] || anims.FADE;

  return (
    <AnimatePresence>
      {activePopupId && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: popup.overlayColor }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            key={popup.id}
            {...(anim as Record<string, object>)}
            transition={{ duration: 0.35 }}
            className={`relative shadow-2xl overflow-hidden ${
              popup.type === "BANNER_TOP" ? "absolute top-0 left-0 right-0" :
              popup.type === "BANNER_BOTTOM" ? "absolute bottom-0 left-0 right-0" :
              popup.type === "SLIDE_IN" ? "absolute bottom-6 left-6" : ""
            }`}
            style={{
              backgroundColor: popup.backgroundColor,
              color: popup.textColor,
              borderRadius: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? popup.borderRadius : 0,
              maxWidth: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? popup.maxWidth : "100%",
              width: popup.type === "MODAL" || popup.type === "SLIDE_IN" ? "92%" : "100%",
            }}
          >
            <button onClick={close} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-lg font-bold z-10" style={{ color: popup.textColor }}>✕</button>
            {popup.image && <div className="w-full h-48 overflow-hidden"><img src={popup.image} alt="" className="w-full h-full object-cover" /></div>}
            <div className={`p-6 text-center`} dir={locale === "ar" ? "rtl" : "ltr"}>
              {(locale === "ar" ? popup.titleAr : popup.titleEn) && <h3 className="text-2xl font-bold mb-3">{locale === "ar" ? popup.titleAr : popup.titleEn}</h3>}
              {(locale === "ar" ? popup.contentAr : popup.contentEn) && <p className="text-sm leading-relaxed opacity-80 mb-6">{locale === "ar" ? popup.contentAr : popup.contentEn}</p>}
              {popup.buttons && Array.isArray(popup.buttons) && popup.buttons.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {(popup.buttons as PopupButton[]).map(btn => (
                    <button key={btn.id} onClick={() => handleButtonClick(btn)} style={{ backgroundColor: btn.bgColor, color: btn.textColor, borderRadius: popup.borderRadius / 2 }} className="px-6 py-2.5 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">{locale === "ar" ? btn.textAr : btn.textEn}</button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
