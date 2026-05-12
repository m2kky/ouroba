"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Locale = "ar" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (ar: string | null | undefined, en: string | null | undefined) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "ar",
  setLocale: () => {},
  t: (ar) => ar || "",
});

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Detects locale from the current URL path.
 * 
 * Handles all routing patterns in the app:
 * 1. Home: /en → en, / → ar
 * 2. Suffix locale: /recipes/ar, /products/details/43/en, /brands/5/ar
 * 3. No locale in URL: /products, /contact → read from cookie
 */
function detectLocaleFromPath(pathname: string): Locale | null {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  return null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine initial locale: URL > Cookie > default "ar"
  const urlLocale = detectLocaleFromPath(pathname);
  const cookieLocale = getCookie("preferred-locale") as Locale | null;
  const initialLocale = urlLocale || cookieLocale || "ar";

  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Update locale when pathname changes (user navigated to a page with locale in URL)
  useEffect(() => {
    const detected = detectLocaleFromPath(pathname);
    if (detected && detected !== locale) {
      setLocaleState(detected);
      setCookie("preferred-locale", detected);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("preferred-locale", newLocale);
    
    // Update document direction and language
    document.documentElement.dir = newLocale === "en" ? "ltr" : "rtl";
    document.documentElement.lang = newLocale;
  }, []);

  // Set direction on mount
  useEffect(() => {
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
    document.documentElement.lang = locale;
  }, [locale]);

  // Helper: pick the right translation
  const t = useCallback(
    (ar: string | null | undefined, en: string | null | undefined): string => {
      if (locale === "en") return en || ar || "";
      return ar || en || "";
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
