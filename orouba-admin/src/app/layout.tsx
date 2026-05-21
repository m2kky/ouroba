import type { Metadata } from "next";
import { Amaranth, Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteData } from "@/lib/api-client";

import { headers } from "next/headers";
import { LocaleProvider } from "@/lib/locale-context";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GlobalPopupManager from "@/components/ui/GlobalPopupManager";
import ChatWidget from "@/components/ui/ChatWidget";

const amaranth = Amaranth({
  variable: "--font-amaranth",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  let favicon = "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png";
  try {
    const data = await getSiteData();
    const settings = data?.settings || {};
    favicon = settings?.favicon_logo?.en || settings?.favicon_logo?.ar || favicon;
  } catch(e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    icons: {
      icon: favicon
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine locale from middleware header
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || "/";
  const isEn = pathname.startsWith('/en');
  const locale = isEn ? "en" : "ar";
  const dir = isEn ? "ltr" : "rtl";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${amaranth.variable} ${tajawal.variable} antialiased min-h-screen flex flex-col overflow-x-hidden w-full font-sans`}
        style={{ fontFamily: isEn ? 'var(--font-amaranth), sans-serif' : 'var(--font-tajawal), sans-serif' }}
        suppressHydrationWarning
      >
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
