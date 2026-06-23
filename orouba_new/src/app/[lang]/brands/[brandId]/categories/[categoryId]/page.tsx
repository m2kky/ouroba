import BrandsView from "@/views/brands/index";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  brandCategories,
  categoryProducts,
  findDashboardBrand,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { createPageMetadata, firstText, localizedField } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; brandId: string; categoryId: string }>;
}): Promise<Metadata> {
  const { lang, brandId, categoryId } = await params;
  const siteData = await getDashboardSiteData(lang);
  const brandData = findDashboardBrand(siteData, brandId);
  const selectedCategory = brandData
    ? (brandCategories(brandData) as Array<Record<string, unknown>>).find(
        (category) => category?.id === categoryId
      )
    : null;

  if (!brandData || !selectedCategory) {
    return createPageMetadata({
      lang,
      path: `/brands/${brandId}/categories/${categoryId}`,
      title: lang === "en" ? "Brand Category" : "تصنيف المنتجات",
      noIndex: true,
    });
  }

  const categoryName = localizedField(selectedCategory, lang, "name");
  const brandName = localizedField(brandData, lang, "name");

  return createPageMetadata({
    lang,
    path: `/brands/${brandId}/categories/${categoryId}`,
    title: firstText(
      categoryName && brandName ? `${categoryName} - ${brandName}` : "",
      categoryName,
      brandName
    ),
    description: firstText(
      localizedField(selectedCategory, lang, "description"),
      localizedField(brandData, lang, "description")
    ),
    image: firstText(
      selectedCategory.imageEn,
      selectedCategory.image_en,
      selectedCategory.image,
      brandData.image_en,
      brandData.image
    ),
  });
}

export default async function BrandsCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; brandId: string; categoryId: string }>;
}) {
  const { lang, brandId, categoryId } = await params;
  const siteData = await getDashboardSiteData(lang);
  const brandData = findDashboardBrand(siteData, brandId);

  if (!brandData) {
    notFound();
  }

  const categories = brandCategories(brandData) as Array<Record<string, unknown>>;
  const selectedCategory = categories.find((category) => category?.id === categoryId);

  if (!selectedCategory) {
    notFound();
  }

  return (
    <BrandsView
      data={resolveMediaTree(categories)}
      brandData={resolveMediaTree(brandData)}
      products={resolveMediaTree(categoryProducts(selectedCategory, lang))}
      categoryId={categoryId}
      brandId={brandId}
    />
  );
}
