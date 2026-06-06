import BrandCategoryDataView from "@/views/BrandCategoryData/index";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  brandCategories,
  findDashboardBrand,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function BrandMainPage({
  params,
}: {
  params: Promise<{ lang: string; brandId: string }>;
}) {
  const { lang, brandId } = await params;
  const siteData = await getDashboardSiteData(lang);
  const brandData = findDashboardBrand(siteData, brandId);

  if (!brandData) {
    notFound();
  }

  const data = {
    brand: brandData,
    relatedCats: brandCategories(brandData),
  };

  return <BrandCategoryDataView data={resolveMediaTree(data)} id={brandId} />;
}
