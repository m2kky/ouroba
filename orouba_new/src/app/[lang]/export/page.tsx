import ExportView from "@/views/Export/Export";
import type { Metadata } from "next";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const revalidate = 300;

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const exportData = await getExportData(lang);
  const siteinfo = exportData.siteinfo;
  const isArabic = lang !== "en";

  return staticPageMetadata(lang, "export", {
    description: firstText(
      isArabic ? siteinfo.export_world_ar : siteinfo.export_world_en,
      isArabic ? siteinfo.world_text_ar : siteinfo.world_text_en,
      siteinfo.world_text
    ),
    image: firstText(siteinfo.exportMap, siteinfo.map, siteinfo.home_world_image),
  });
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
