import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteData } from "@/lib/api-client";

import { headers } from "next/headers";
import { LocaleProvider } from "@/lib/locale-context";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GlobalPopupManager from "@/components/ui/GlobalPopupManager";
import ChatWidget from "@/components/ui/ChatWidget";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  icons: {
    icon: "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"
  }
};

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
        className={`${cairo.variable} font-cairo antialiased min-h-screen flex flex-col overflow-x-hidden w-full ${isEn ? "font-sans" : ""}`}
        suppressHydrationWarning
      >
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
