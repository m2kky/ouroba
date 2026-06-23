import ProductTypeView from "@/views/productType/productType";
import type { Metadata } from "next";
import { resolveMediaTree } from "@/utils/media";
import {
  categoryTypes,
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  try {
    const data = await getDashboardSiteData(lang);
    const siteinfo = dashboardSettingsToSiteinfo(data.settings, lang);
    const isArabic = lang !== "en";

    return staticPageMetadata(lang, "productTypes", {
      description: firstText(
        isArabic ? siteinfo.product_type_text_ar : siteinfo.product_type_text_en
      ),
      image: firstText(siteinfo.product_type_img, siteinfo.logo),
    });
  } catch {
    return staticPageMetadata(lang, "productTypes");
  }
}

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
