import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "rsuite/Loader/styles/index.css";
import "@/styles/orouba-main.css";
import "../globals.css";
import StoreProvider from "@/components/StoreProvider";
import LocalizedDigits from "@/components/LocalizedDigits";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";
import { mergeDashboardSocialLinks } from "@/utils/socialLinks";

export const metadata: Metadata = {
  title: "Orouba Foods",
  description: "Orouba Foods Official Website",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export const revalidate = 300;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const languageClass = lang === "ar" ? "arVersion" : "enVersion";
  let layoutData = {
    siteinfo: {} as Record<string, string>,
    brands: [] as any[],
    socialParents: [] as any[],
  };

  try {
    const data = await getDashboardSiteData(lang);
    const socials = Array.isArray(data.socials) ? data.socials : [];
    const parents = Array.isArray(data.socialParents) ? data.socialParents : [];
    const siteinfo = dashboardSettingsToSiteinfo(data.settings, lang);
    const socialParents = parents.map((parent: any) => ({
      ...parent,
      socials: socials.filter((social: any) => social?.parentId === parent?.id),
    }));

    layoutData = {
      siteinfo,
      brands: (Array.isArray(data.brands) ? data.brands : []).map((brand: any) => ({
        ...brand,
        name_ar: brand?.nameAr || brand?.name_ar,
        name_en: brand?.nameEn || brand?.name_en,
      })),
      socialParents: mergeDashboardSocialLinks(socialParents, siteinfo),
    };
  } catch {
    layoutData = {
      siteinfo: {},
      brands: [],
      socialParents: [],
    };
  }

  const resolvedLayoutData = resolveMediaTree(layoutData);

  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={languageClass} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
        <StoreProvider initialLanguage={lang}>
          <LocalizedDigits locale={lang} />
          <div className="defaultLayout">
            <Header brands={resolvedLayoutData.brands} siteinfo={resolvedLayoutData.siteinfo} />
            <main>{children}</main>
            <Footer
              brands={resolvedLayoutData.brands}
              siteinfo={resolvedLayoutData.siteinfo}
              socialParents={resolvedLayoutData.socialParents}
            />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
