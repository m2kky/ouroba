import ProductTypeView from "@/views/productType/productType";
import { db } from "@/db";
import { categoryTypes, siteSettings } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

export default async function ProductTypesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  // 1. Fetch Category Types with related Categories and Brands
  const typesData = await db.query.categoryTypes.findMany({
    where: eq(categoryTypes.isHidden, false),
    orderBy: (categoryTypes, { asc }) => [asc(categoryTypes.number)],
    with: {
      categories: {
        with: {
          category: {
            with: {
              brand: true,
            },
          },
        },
      },
    },
  });

  // Transform data to match what the component expects
  const formattedTypes = typesData
    .filter((type) => type.titleEn?.toLowerCase() !== "products")
    .map((type) => ({
      ...type,
      cattype: type.categories
        .filter((cattype) => {
          const category = cattype.category;
          const brand = category?.brand;
          return category && !category.isHidden && !brand?.isHidden;
        })
        .sort((a, b) => (a.number ?? 999) - (b.number ?? 999))
        .map((cattype) => ({
          ...cattype,
          brand: cattype.category?.brand,
          category_id: cattype.categoryId,
          name_ar: cattype.category?.nameAr,
          name_en: cattype.category?.nameEn,
          relation_image: cattype.image,
          category_image: cattype.category?.image,
          category_image_en: cattype.category?.imageEn,
        })),
    }));

  // 2. Fetch page text and image
  const settingsKeys = ["product_type_img", "product_type_text_en", "product_type_text_ar"];
  const settingsData = await db.query.siteSettings.findMany({
    where: inArray(siteSettings.key, settingsKeys),
  });

  const pageDataObj: Record<string, string | null | undefined> = {};
  settingsData.forEach((setting) => {
    pageDataObj[setting.key] = setting.valueEn || setting.valueAr;
  });

  return <ProductTypeView types={resolveMediaTree(formattedTypes)} pageDataObj={resolveMediaTree(pageDataObj)} />;
}
