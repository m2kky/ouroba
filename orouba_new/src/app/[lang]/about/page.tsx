import WhoWeAreView from "@/views/WhoWeAre/WhoWeAre";
import type { Metadata } from "next";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const revalidate = 300;

type AboutData = {
  sections: unknown[];
  buildings: unknown[];
  productionSteps: unknown[];
  features: unknown[];
  siteInfo: Record<string, string | null | undefined>;
};

const emptyAboutData: AboutData = {
  sections: [],
  buildings: [],
  productionSteps: [],
  features: [],
  siteInfo: {},
};

async function getAboutData(locale: string): Promise<AboutData> {
  try {
    const data = await getDashboardSiteData(locale);

    return {
      sections: Array.isArray(data.sectionTexts) ? data.sectionTexts : [],
      buildings: Array.isArray(data.buildings) ? data.buildings : [],
      productionSteps: Array.isArray(data.productionSteps) ? data.productionSteps : [],
      features: Array.isArray(data.features) ? data.features : [],
      siteInfo: dashboardSettingsToSiteinfo(data.settings, locale),
    };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return emptyAboutData;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const aboutData = await getAboutData(lang);
  const siteInfo = aboutData.siteInfo;
  const isArabic = lang !== "en";

  return staticPageMetadata(lang, "about", {
    description: firstText(
      isArabic ? siteInfo.how_we_are_ar : siteInfo.how_we_are_en,
      isArabic ? siteInfo.vision_ar : siteInfo.vision_en
    ),
    image: firstText(siteInfo.about_image, siteInfo.small_about_img, siteInfo.vision_image),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const aboutData = await getAboutData(lang);

  return <WhoWeAreView aboutData={resolveMediaTree(aboutData)} />;
}
