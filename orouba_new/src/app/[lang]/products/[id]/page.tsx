import ProductTypeCategoryView from "@/views/productType/productTypeCategory";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";
import {
  getDashboardProduct,
  getDashboardSiteData,
  sameBrandTypeProducts,
} from "@/lib/dashboard-data";
import { createPageMetadata, firstText, localizedField } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductBrand = {
  id?: string;
  nameEn?: string;
  nameAr?: string;
};

type ProductCategory = {
  id?: string;
  nameEn?: string;
  nameAr?: string;
  brand?: ProductBrand | null;
};

type ProductRecipeRelation = {
  recipe?: unknown;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const productData = await getDashboardProduct(id);

  if (!productData || productData.isHidden) {
    return createPageMetadata({
      lang,
      path: `/products/${id}`,
      title: lang === "en" ? "Product" : "منتج",
      noIndex: true,
    });
  }

  return createPageMetadata({
    lang,
    path: `/products/${id}`,
    title: localizedField(productData, lang, "name"),
    description: localizedField(productData, lang, "description"),
    image: firstText(
      productData.images?.[0]?.url,
      productData.internalImage,
      productData.internal_image,
      productData.image
    ),
  });
}

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
  const category = categoryRelation?.category as ProductCategory | undefined;
  const brand = category?.brand;

  const breads = {
    brandId: brand?.id || "",
    brandNameEn: brand?.nameEn || "",
    brandNameAr: brand?.nameAr || "",
    categoryId: category?.id || "",
    categoryNameEn: category?.nameEn || "",
    categoryNameAr: category?.nameAr || "",
  };
  const relatedType = {
    name_en: productData.type?.nameEn || category?.nameEn || "",
    name_ar: productData.type?.nameAr || category?.nameAr || "",
  };

  const sameProducts =
    brand?.id && productData.typeId
      ? sameBrandTypeProducts(siteData, brand.id, productData.typeId, id, lang)
      : [];

  // Recipes related to this product via recommendedRecipes relation
  const recipes =
    productData.recommendedRecipes?.map((relation: ProductRecipeRelation) => relation.recipe) ||
    [];

  return (
    <ProductTypeCategoryView
      data={resolveMediaTree(productData)}
      breads={breads}
      sameProducts={resolveMediaTree(sameProducts)}
      recipes={resolveMediaTree(recipes)}
      brandId={brand?.id}
      relatedType={relatedType}
    />
  );
}
