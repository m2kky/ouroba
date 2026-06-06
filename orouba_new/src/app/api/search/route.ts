import { NextRequest, NextResponse } from "next/server";
import { getDashboardSiteData } from "@/lib/dashboard-data";

const text = (value: unknown) => String(value || "").toLowerCase();

function productImage(product: any, relation: any, category: any) {
  return (
    product?.images?.find((image: any) => image?.url)?.url ||
    product?.image ||
    relation?.image ||
    category?.image ||
    ""
  );
}

function flattenProducts(brands: unknown[]) {
  const products: any[] = [];

  (Array.isArray(brands) ? brands : []).forEach((brand: any) => {
    (Array.isArray(brand?.categories) ? brand.categories : []).forEach((category: any) => {
      (Array.isArray(category?.products) ? category.products : []).forEach((relation: any) => {
        const product = relation?.product || relation;
        if (!product?.id || product?.isHidden) return;

        products.push({
          ...product,
          brand,
          category,
          image: productImage(product, relation, category),
          name_ar: product?.nameAr || product?.name_ar,
          name_en: product?.nameEn || product?.name_en,
        });
      });
    });
  });

  return products;
}

function matches(item: any, query: string, keys: string[]) {
  return keys.some((key) => text(item?.[key]).includes(query));
}

export async function GET(request: NextRequest) {
  const query = text(request.nextUrl.searchParams.get("q")).trim();
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "ar";

  if (!query) {
    return NextResponse.json({ success: true, result: { products: [], cooks: [] } });
  }

  try {
    const data = await getDashboardSiteData(locale);
    const products = flattenProducts(data.brands || [])
      .filter((product) =>
        matches(product, query, ["nameAr", "nameEn", "name_ar", "name_en", "descriptionAr", "descriptionEn"])
      )
      .slice(0, 12);
    const cooks = (Array.isArray(data.recipes) ? data.recipes : [])
      .filter((recipe: any) =>
        !recipe?.isHidden &&
        matches(recipe, query, ["nameAr", "nameEn", "name_ar", "name_en", "descriptionAr", "descriptionEn"])
      )
      .slice(0, 12)
      .map((recipe: any) => ({
        ...recipe,
        image: recipe?.internalImage || recipe?.image || "",
        name_ar: recipe?.nameAr || recipe?.name_ar,
        name_en: recipe?.nameEn || recipe?.name_en,
      }));

    return NextResponse.json({ success: true, result: { products, cooks } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Search failed", result: { products: [], cooks: [] } },
      { status: 500 }
    );
  }
}
