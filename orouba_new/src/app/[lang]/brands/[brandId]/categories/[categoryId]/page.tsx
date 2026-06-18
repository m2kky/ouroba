import BrandsView from "@/views/brands/index";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  brandCategories,
  categoryProducts,
  findDashboardBrand,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const revalidate = 300;

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

  const categories = brandCategories(brandData);
  const selectedCategory = categories.find((category: any) => category?.id === categoryId);

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
