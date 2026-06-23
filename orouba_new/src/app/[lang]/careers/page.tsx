import CareersView from "@/views/Careers/Careers";
import type { Metadata } from "next";
import { dashboardSettingsToSiteinfo, getDashboardSiteData } from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCareersData(lang: string) {
  try {
    const data = await getDashboardSiteData(lang);
    return {
      whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs : [],
      siteinfo: dashboardSettingsToSiteinfo(data.settings, lang),
    };
  } catch {
    return { whyChooseUs: [] as unknown[], siteinfo: {} as Record<string, string> };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const careerData = await getCareersData(lang);
  const isArabic = lang !== "en";

  return staticPageMetadata(lang, "careers", {
    description: firstText(
      isArabic ? careerData.siteinfo.why_choose_ar : careerData.siteinfo.why_choose_en,
      isArabic ? careerData.siteinfo.why_orouba_ar : careerData.siteinfo.why_orouba_en
    ),
    image: firstText(careerData.siteinfo.why_choose_img, careerData.siteinfo.why_orouba_img),
  });
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const careerData = await getCareersData(lang);

  return <CareersView careerData={resolveMediaTree(careerData)} />;
}
