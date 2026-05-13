import { redirect } from "next/navigation";

export default async function BrandsLegacyRoute({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  // Expected legacy slug: [brandName, brandId, categoryId, categoryName]
  // We need brandId (index 1) and categoryId (index 2)
  if (slug.length >= 3) {
    const brandId = slug[1];
    const categoryId = slug[2];
    redirect(`/${locale}/brands/${brandId}/${categoryId}`);
  }

  // Fallback to home if slug is invalid
  redirect(`/${locale}`);
}
