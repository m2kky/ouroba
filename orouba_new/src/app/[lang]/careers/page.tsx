import CareersView from "@/views/Careers/Careers";
import { getDashboardSiteData } from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

export default async function CareersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  let careerData = { whyChooseUs: [] as unknown[] };

  try {
    const data = await getDashboardSiteData(lang);
    careerData = {
      whyChooseUs: Array.isArray(data.whyChooseUs) ? data.whyChooseUs : [],
    };
  } catch {
    careerData = { whyChooseUs: [] };
  }

  return <CareersView careerData={resolveMediaTree(careerData)} />;
}
