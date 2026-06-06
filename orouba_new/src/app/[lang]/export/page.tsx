import ExportView from "@/views/Export/Export";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type ExportData = {
  siteinfo: Record<string, string | null | undefined>;
  continents: unknown[];
  standers: unknown[];
  certifications: unknown[];
};

async function getExportData(locale: string): Promise<ExportData> {
  try {
    const data = await getDashboardSiteData(locale);

    return {
      siteinfo: dashboardSettingsToSiteinfo(data.settings, locale),
      continents: Array.isArray(data.continents) ? data.continents : [],
      standers: Array.isArray(data.standards) ? data.standards : [],
      certifications: Array.isArray(data.certificates) ? data.certificates : [],
    };
  } catch {
    return {
      siteinfo: {},
      continents: [],
      standers: [],
      certifications: [],
    };
  }
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const exportPageData = await getExportData(lang);

  return <ExportView exportPage={resolveMediaTree(exportPageData)} />;
}
