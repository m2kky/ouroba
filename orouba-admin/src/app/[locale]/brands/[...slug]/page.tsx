import { redirect } from "next/navigation";

export default async function BrandsLegacyRoute({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  // Legacy slug patterns:
  // [brandName, brandId, categoryId, categoryName] - 4 segments → redirect to proper nested route
  // [brandName, brandId, categoryId] - 3 segments → redirect with category
  // [brandName, brandId] - 2 segments → this should match [brandName]/[id] route, not reach here
  // [brandId] - 1 segment → old-style link with just brand id, redirect to brands list
  
  if (slug.length >= 4) {
    // Full legacy URL with brand name, brand id, category id, category name
    const brandName = slug[0];
    const brandId = slug[1];
    const categoryId = slug[2];
    const categoryName = slug[3];
    redirect(`/${locale}/brands/${brandName}/${brandId}/${categoryId}/${categoryName}`);
  }

  if (slug.length === 3) {
    const brandName = slug[0];
    const brandId = slug[1];
    const categoryId = slug[2];
    redirect(`/${locale}/brands/${brandName}/${brandId}/${categoryId}/products`);
  }

  // For 1-2 segments or any other case, go to brands index
  redirect(`/${locale}/brands`);
}
