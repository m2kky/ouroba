import BrandsView from "@/views/brands/index";
import { db } from "@/db";
import { brands, categories, categoryProducts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

export default async function BrandsCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; brandId: string; categoryId: string }>;
}) {
  const { lang, brandId, categoryId } = await params;

  // Fetch Brand Data
  const brandData = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  });

  if (!brandData) {
    notFound();
  }

  // Fetch Categories for this Brand
  const brandCategories = await db.query.categories.findMany({
    where: eq(categories.brandId, brandId),
    orderBy: (categories, { asc }) => [asc(categories.number)],
  });

  // Fetch Products for the selected Category
  const products = await db.query.categoryProducts.findMany({
    where: eq(categoryProducts.categoryId, categoryId),
    with: {
      product: {
        with: {
          images: true,
        },
      },
    },
  });

  return (
    <BrandsView
      data={resolveMediaTree(brandCategories)}
      brandData={resolveMediaTree(brandData)}
      products={resolveMediaTree(products)}
      categoryId={categoryId}
      brandId={brandId}
    />
  );
}
