import BrandCategoryDataView from "@/views/BrandCategoryData/index";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export default async function BrandMainPage({
  params,
}: {
  params: Promise<{ lang: string; brandId: string }>;
}) {
  const { brandId } = await params;

  // Fetch Brand Data
  const brandData = await db.query.brands.findFirst({
    where: and(eq(brands.id, brandId), eq(brands.isHidden, false)),
  });

  if (!brandData) {
    notFound();
  }

  // Fetch related categories for the brand (legacy $relatedCats)
  const relatedCatsData = await db.query.categories.findMany({
    where: (categories, { and, eq }) => and(eq(categories.brandId, brandId), eq(categories.isHidden, false)),
    orderBy: (categories, { asc }) => [asc(categories.number)],
  });

  const formattedCats = relatedCatsData.map((cat) => ({
    ...cat,
    name_ar: cat.nameAr,
    name_en: cat.nameEn,
  }));

  const data = {
    brand: {
      ...brandData,
      color: brandData.colorBrand,
    },
    relatedCats: formattedCats,
  };

  return <BrandCategoryDataView data={resolveMediaTree(data)} id={brandId} />;
}
