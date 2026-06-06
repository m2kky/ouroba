import ProductTypeCategoryView from "@/views/productType/productTypeCategory";
import { db } from "@/db";
import { products, categoryProducts, recommendedRecipes, categories } from "@/db/schema";
import { eq, inArray, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  // 1. Fetch Product details
  const productData = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      images: true,
      categories: {
        with: {
          category: {
            with: {
              brand: true,
            },
          },
        },
      },
      recommendedRecipes: {
        with: {
          recipe: {
            with: {
              images: true,
            }
          }
        }
      }
    },
  });

  if (!productData) {
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

  // Fetch "same_products" (products in same brand and same type)
  let sameProducts: any[] = [];
  if (brand?.id && productData.typeId) {
    // 1. Get all categories for this brand
    const brandCategories = await db.query.categories.findMany({
      where: eq(categories.brandId, brand.id),
      columns: { id: true },
    });
    const categoryIds = brandCategories.map(c => c.id);

    if (categoryIds.length > 0) {
      // 2. Get products in these categories
      const brandCatProducts = await db.query.categoryProducts.findMany({
        where: inArray(categoryProducts.categoryId, categoryIds),
        columns: { productId: true },
      });
      const validProductIds = brandCatProducts.map(cp => cp.productId).filter((id): id is string => id !== null);

      if (validProductIds.length > 0) {
        // 3. Fetch matching products, ordered by number ascending
        const fetchedProducts = await db.query.products.findMany({
          where: and(
            inArray(products.id, validProductIds),
            eq(products.typeId, productData.typeId),
            eq(products.isHidden, false)
          ),
          with: {
            images: true,
          },
          orderBy: [asc(products.number)],
        });
        
        sameProducts = fetchedProducts.filter(p => p.id !== id);
      }
    }
  }

  // Recipes related to this product via recommendedRecipes relation
  const recipes = productData.recommendedRecipes?.map(r => r.recipe) || [];

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
