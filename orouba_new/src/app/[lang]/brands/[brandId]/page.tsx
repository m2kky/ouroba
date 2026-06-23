import BrandCategoryDataView from "@/views/BrandCategoryData/index";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  brandCategories,
  findDashboardBrand,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { createPageMetadata, firstText, localizedField } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; brandId: string }>;
}): Promise<Metadata> {
  const { lang, brandId } = await params;
  const siteData = await getDashboardSiteData(lang);
  const brandData = findDashboardBrand(siteData, brandId);

  if (!brandData) {
    return createPageMetadata({
      lang,
      path: `/brands/${brandId}`,
      title: lang === "en" ? "Brand" : "علامة تجارية",
      noIndex: true,
    });
  }

  return createPageMetadata({
    lang,
    path: `/brands/${brandId}`,
    title: localizedField(brandData, lang, "name"),
    description: localizedField(brandData, lang, "description"),
    image: firstText(brandData.image_en, brandData.image, brandData.small_img, brandData.logo),
  });
}

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
