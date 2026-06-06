import ProductTypeView from "@/views/productType/productType";
import { resolveMediaTree } from "@/utils/media";
import {
  categoryTypes,
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function ProductTypesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = await getDashboardSiteData(lang);
  const siteinfo = dashboardSettingsToSiteinfo(data.settings, lang);

  return (
    <ProductTypeView
      types={resolveMediaTree(categoryTypes(data))}
      pageDataObj={resolveMediaTree(siteinfo)}
    />
  );
}
