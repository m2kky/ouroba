import ProductTypeView from "@/views/productType/productType";
import { db } from "@/db";
import { categoryTypes, siteSettings } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

export default async function ProductTypesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 1. Fetch Category Types with related Categories and Brands
  const typesData = await db.query.categoryTypes.findMany({
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
  const formattedTypes = typesData.map((type) => ({
    ...type,
    cattype: type.categories.map((cattype) => ({
      ...cattype,
      brand: cattype.category?.brand,
      category_id: cattype.categoryId,
      name_ar: cattype.category?.nameAr,
      name_en: cattype.category?.nameEn,
      image: cattype.category?.image,
    })),
  }));

  // 2. Fetch page text and image
  const settingsKeys = ["product_type_img", "product_type_text_en", "product_type_text_ar"];
  const settingsData = await db.query.siteSettings.findMany({
    where: inArray(siteSettings.key, settingsKeys),
  });

  const pageDataObj: Record<string, any> = {};
  settingsData.forEach((setting) => {
    pageDataObj[setting.key] = setting.valueEn || setting.valueAr;
  });

  return <ProductTypeView types={resolveMediaTree(formattedTypes)} pageDataObj={resolveMediaTree(pageDataObj)} />;
}
