import CareersView from "@/views/Careers/Careers";
import { dashboardSettingsToSiteinfo, getDashboardSiteData } from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  let careerData = { whyChooseUs: [] as unknown[], siteinfo: {} as Record<string, string> };

  try {
    const data = await getDashboardSiteData(lang);
    careerData = {
      whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs : [],
      siteinfo: dashboardSettingsToSiteinfo(data.settings, lang),
    };
  } catch {
    careerData = { whyChooseUs: [], siteinfo: {} };
  }

  return <CareersView careerData={resolveMediaTree(careerData)} />;
}
