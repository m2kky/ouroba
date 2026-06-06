import ProductTypeCategoryView from "@/views/productType/productTypeCategory";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  getDashboardProduct,
  getDashboardSiteData,
  sameBrandTypeProducts,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  const [productData, siteData] = await Promise.all([
    getDashboardProduct(id),
    getDashboardSiteData(lang),
  ]);

  if (!productData || productData.isHidden) {
    notFound();
  }

  const categoryRelation = productData.categories?.[0];
  const category = categoryRelation?.category as any;
  const brand = category?.brand;

  const breads = {
    brandId: brand?.id || "",
    brandNameEn: brand?.nameEn || "",
    brandNameAr: brand?.nameAr || "",
    categoryId: category?.id || "",
    categoryNameEn: category?.nameEn || "",
    categoryNameAr: category?.nameAr || "",
  };

  const sameProducts =
    brand?.id && productData.typeId
      ? sameBrandTypeProducts(siteData, brand.id, productData.typeId, id, lang)
      : [];

  // Recipes related to this product via recommendedRecipes relation
  const recipes = productData.recommendedRecipes?.map((r: any) => r.recipe) || [];

  return (
    <ProductTypeCategoryView
      data={resolveMediaTree(productData)}
      breads={breads}
      sameProducts={resolveMediaTree(sameProducts)}
      recipes={resolveMediaTree(recipes)}
      brandId={brand?.id}
    />
  );
}
