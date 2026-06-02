import BrandCategoryDataView from "@/views/BrandCategoryData/index";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { resolveMediaTree } from "@/utils/media";

export default async function BrandMainPage({
  params,
}: {
  params: Promise<{ lang: string; brandId: string }>;
}) {
  const { lang, brandId } = await params;

  // Fetch Brand Data
  const brandData = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  });

  if (!brandData) {
    notFound();
  }

  // The legacy BrandCategoryData view fetched brand details which contained brand info.
  // Recipes related to this brand and WhyUs data.
  // We will format the data as expected.
  const data = {
    brand: brandData,
  };

  return <BrandCategoryDataView data={resolveMediaTree(data)} id={brandId} />;
}
