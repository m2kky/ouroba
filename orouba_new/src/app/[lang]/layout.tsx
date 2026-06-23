import type { Metadata } from "next";
import { Amaranth, Baloo_Bhaijaan_2, Cairo, Tajawal } from "next/font/google";
import "rsuite/Loader/styles/index.css";
import "@/styles/orouba-main.css";
import "../globals.css";
import "../performance-overrides.css";
import MediaLoadState from "@/components/MediaLoadState";
import StoreProvider from "@/components/StoreProvider";
import LocalizedDigits from "@/components/LocalizedDigits";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { staticPageMetadata } from "@/lib/seo";
import { resolveMediaTree } from "@/utils/media";
import { mergeDashboardSocialLinks } from "@/utils/socialLinks";

type LayoutBrand = Record<string, unknown> & {
  nameAr?: string | null;
  nameEn?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
};

type SocialRecord = Record<string, unknown> & {
  parentId?: string | null;
};

type SocialParentRecord = Record<string, unknown> & {
  id?: string | null;
};

type LayoutData = {
  siteinfo: Record<string, string>;
  brands: LayoutBrand[];
  socialParents: unknown[];
};

const amaranth = Amaranth({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-amaranth",
  weight: ["400", "700"],
});

const baloo = Baloo_Bhaijaan_2({
  display: "swap",
  subsets: ["arabic", "latin"],
  variable: "--font-baloo",
});

const cairo = Cairo({
  display: "swap",
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const tajawal = Tajawal({
  display: "swap",
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const metadata = staticPageMetadata(lang, "home");

  return {
    ...metadata,
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  let layoutData: LayoutData = {
    siteinfo: {},
    brands: [],
    socialParents: [],
  };

  try {
    const data = await getDashboardSiteData(lang);
    const socials = Array.isArray(data.socials) ? (data.socials as SocialRecord[]) : [];
    const parents = Array.isArray(data.socialParents)
      ? (data.socialParents as SocialParentRecord[])
      : [];
    const siteinfo = dashboardSettingsToSiteinfo(data.settings, lang);
    const socialParents = parents.map((parent) => ({
      ...parent,
      socials: socials.filter((social) => social?.parentId === parent?.id),
    }));

    layoutData = {
      siteinfo,
      brands: (Array.isArray(data.brands) ? (data.brands as LayoutBrand[]) : []).map((brand) => ({
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
      <head />
      <body
        className={`${languageClass} ${amaranth.variable} ${baloo.variable} ${cairo.variable} ${tajawal.variable}`}
        dir={lang === "ar" ? "rtl" : "ltr"}
        suppressHydrationWarning
      >
        <MediaLoadState />
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
