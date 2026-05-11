import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteData } from "@/lib/api-client";

import SmoothScroll from "@/components/layout/SmoothScroll";
import GlobalPopupManager from "@/components/ui/GlobalPopupManager";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "العروبة للصناعات الغذائية | Orouba Foods",
  description: "تذوق الطعم الطازج مع منتجات العروبة للصناعات الغذائية",
  icons: {
    icon: "https://oroubafoods.com/static/media/logo.c0b669f6b893b6ff3c5b.png"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global site data for layout components
  let data = null;
  try {
    data = await getSiteData();
  } catch (error) {
    console.error("Failed to load site data for layout", error);
  }

  const settings = data?.settings || {};
  const brands = data?.brands || [];
  const socials = data?.socials || [];

  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} font-cairo antialiased min-h-screen flex flex-col`}
      >
        <SmoothScroll>
          <Navbar settings={settings} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer settings={settings} socials={socials} brands={brands} />
          <GlobalPopupManager />
        </SmoothScroll>
      </body>
    </html>
  );
}
