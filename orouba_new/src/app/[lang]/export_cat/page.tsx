import ExportCatalogView from "@/views/ExportCatalog/ExportCatalog";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function ExportCatalogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let siteSetting: Record<string, string> = {};

  try {
    const data = await getDashboardSiteData(lang);
    siteSetting = dashboardSettingsToSiteinfo(data.settings, lang);
  } catch {
    siteSetting = {};
  }

  return <ExportCatalogView exportCatData={resolveMediaTree(siteSetting)} />;
}
