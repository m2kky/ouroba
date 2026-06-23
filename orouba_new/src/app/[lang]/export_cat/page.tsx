import ExportCatalogView from "@/views/ExportCatalog/ExportCatalog";
import type { Metadata } from "next";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getExportCatalogSiteInfo(lang: string): Promise<Record<string, string>> {
  try {
    const data = await getDashboardSiteData(lang);
    return dashboardSettingsToSiteinfo(data.settings, lang);
  } catch {
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const siteSetting = await getExportCatalogSiteInfo(lang);
  const isArabic = lang !== "en";

  return staticPageMetadata(lang, "exportCatalog", {
    description: firstText(isArabic ? siteSetting.catalog_ar : siteSetting.catalog_en),
    image: firstText(siteSetting.catalog_image, siteSetting.logo),
  });
}

export default async function ExportCatalogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let siteSetting: Record<string, string> = {};

  siteSetting = await getExportCatalogSiteInfo(lang);

  return <ExportCatalogView exportCatData={resolveMediaTree(siteSetting)} />;
}
