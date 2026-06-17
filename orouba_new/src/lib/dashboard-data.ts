type DashboardSetting =
  | {
      en?: string | null;
      ar?: string | null;
    }
  | string
  | null
  | undefined;

type DashboardSiteData = {
  brands?: unknown[];
  banners?: unknown[];
  recipes?: unknown[];
  certificates?: unknown[];
  values?: unknown[];
  continents?: unknown[];
  standards?: unknown[];
  sectionTexts?: unknown[];
  buildings?: unknown[];
  productionSteps?: unknown[];
  categoryTypes?: unknown[];
  features?: unknown[];
  whyChooseUs?: unknown[];
  socials?: unknown[];
  socialParents?: unknown[];
  recipeCategories?: unknown[];
  settings?: Record<string, DashboardSetting>;
};

const DEFAULT_DASHBOARD_URL = "https://admin.oroubafoods.com";
const LEGACY_DASHBOARD_URL = "https://admin1.oroubafoods.com";
const LOCAL_DASHBOARD_URLS = ["http://localhost:3015", "http://localhost:3000"];

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.map((url) => url.replace(/\/+$/, "")).filter(Boolean)));
}

export function getDashboardBaseUrl() {
  const configuredUrl =
    process.env.OROUBA_DASHBOARD_URL || process.env.NEXT_PUBLIC_OROUBA_DASHBOARD_URL;

  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production") return LOCAL_DASHBOARD_URLS[0];
  return DEFAULT_DASHBOARD_URL;
}

function getDashboardBaseUrls() {
  const configuredUrl =
    process.env.OROUBA_DASHBOARD_URL || process.env.NEXT_PUBLIC_OROUBA_DASHBOARD_URL;

  return uniqueUrls([
    ...(configuredUrl ? [configuredUrl] : []),
    ...(process.env.NODE_ENV !== "production" && !configuredUrl ? LOCAL_DASHBOARD_URLS : []),
    DEFAULT_DASHBOARD_URL,
    LEGACY_DASHBOARD_URL,
  ]);
}

async function fetchDashboard(path: string) {
  let lastError: unknown;

  for (const baseUrl of getDashboardBaseUrls()) {
    try {
      const url = new URL(path, baseUrl);
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return response;
      lastError = new Error(`Dashboard request failed from ${baseUrl}: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Dashboard request failed");
}

function settingValue(value: DashboardSetting, locale: string) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const primary = locale === "ar" ? value.ar : value.en;
  const fallback = locale === "ar" ? value.en : value.ar;
  return (primary || fallback || "").trim();
}

export async function getDashboardSiteData(locale = "ar"): Promise<DashboardSiteData> {
  const response = await fetchDashboard(
    `/api/site-data?locale=${locale === "en" ? "en" : "ar"}`
  );
  const payload = await response.json();
  return payload?.data ?? payload ?? {};
}

export async function getDashboardProduct(productId: string) {
  try {
    const response = await fetchDashboard(`/api/products/${productId}`);
    const payload = await response.json();
    return payload?.data ?? payload ?? null;
  } catch {
    return null;
  }
}

export async function getDashboardRecipe(recipeId: string) {
  try {
    const response = await fetchDashboard(`/api/recipes/${recipeId}`);
    const payload = await response.json();
    return payload?.data ?? payload ?? null;
  } catch {
    return null;
  }
}

export async function getDashboardRecipes(limit = 100) {
  try {
    const response = await fetchDashboard(`/api/recipes?limit=${limit}`);
    const payload = await response.json();
    const data = payload?.data ?? payload ?? {};
    return Array.isArray(data?.recipes) ? data.recipes : [];
  } catch {
    return [];
  }
}

export function dashboardSettingsToSiteinfo(
  settings: DashboardSiteData["settings"],
  locale = "ar"
) {
  const siteinfo: Record<string, string> = {};

  Object.entries(settings || {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      siteinfo[key] = value;
      siteinfo[`${key}Ar`] = value;
      siteinfo[`${key}En`] = value;
      siteinfo[`${key}_ar`] = value;
      siteinfo[`${key}_en`] = value;
      return;
    }

    const ar = settingValue(value, "ar");
    const en = settingValue(value, "en");
    const current = settingValue(value, locale);

    siteinfo[key] = current || ar || en;
    siteinfo[`${key}Ar`] = ar || en;
    siteinfo[`${key}En`] = en || ar;
    siteinfo[`${key}_ar`] = ar || en;
    siteinfo[`${key}_en`] = en || ar;
  });

  return siteinfo;
}

const visible = (item: any) => !item?.isHidden && item?.hidden !== 1;

const numberValue = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 999;

const localizedName = (item: any, locale: string) =>
  locale === "ar"
    ? item?.nameAr || item?.name_ar || ""
    : item?.nameEn || item?.name_en || "";

export const byNumber = (a: any, b: any) =>
  numberValue(a?.number) - numberValue(b?.number);

export const normalizeBrand = (brand: any) => ({
  ...brand,
  name_ar: brand?.nameAr || brand?.name_ar,
  name_en: brand?.nameEn || brand?.name_en,
  color: brand?.colorBrand || brand?.color,
});

export const normalizeCategory = (category: any) => ({
  ...category,
  name_ar: category?.nameAr || category?.name_ar,
  name_en: category?.nameEn || category?.name_en,
});

export const normalizeProduct = (product: any) => ({
  ...product,
  name_ar: product?.nameAr || product?.name_ar,
  name_en: product?.nameEn || product?.name_en,
  internal_image: product?.internalImage || product?.internal_image,
  video_link: product?.videoLink || product?.video_link,
});

export function findDashboardBrand(data: DashboardSiteData, brandId: string) {
  return (Array.isArray(data.brands) ? data.brands : [])
    .map((brand: any) => normalizeBrand(brand))
    .find((brand: any) => brand?.id === brandId && visible(brand));
}

export function brandCategories(brand: any) {
  return (Array.isArray(brand?.categories) ? brand.categories : [])
    .filter((category: any) => visible(category))
    .slice()
    .sort(byNumber)
    .map(normalizeCategory);
}

export function categoryProducts(category: any, locale: string) {
  return (Array.isArray(category?.products) ? category.products : [])
    .filter((relation: any) => visible(relation) && visible(relation?.product))
    .slice()
    .sort((a: any, b: any) => {
      const productNumber = numberValue(a?.product?.number) - numberValue(b?.product?.number);
      if (productNumber !== 0) return productNumber;
      return localizedName(a?.product, locale).localeCompare(localizedName(b?.product, locale), locale);
    })
    .map((relation: any) => ({
      ...relation,
      product: normalizeProduct(relation.product),
    }));
}

export function categoryTypes(data: DashboardSiteData) {
  return (Array.isArray(data.categoryTypes) ? data.categoryTypes : [])
    .filter((type: any) => visible(type) && String(type?.titleEn || "").toLowerCase() !== "products")
    .slice()
    .sort(byNumber)
    .map((type: any) => ({
      ...type,
      cattype: (Array.isArray(type?.categories) ? type.categories : [])
        .filter((relation: any) => {
          const category = relation?.category;
          const brand = category?.brand;
          return category && visible(category) && (!brand || visible(brand));
        })
        .slice()
        .sort(byNumber)
        .map((relation: any) => {
          const category = relation.category;
          return {
            ...relation,
            brand: normalizeBrand(category?.brand),
            category_id: relation?.categoryId,
            name_ar: category?.nameAr || category?.name_ar,
            name_en: category?.nameEn || category?.name_en,
            relation_image: relation?.image,
            category_image: category?.image,
            category_image_en: category?.imageEn || category?.image_en,
          };
        }),
    }));
}

export function sameBrandTypeProducts(
  data: DashboardSiteData,
  brandId: string,
  typeId: unknown,
  currentProductId: string,
  locale: string
) {
  const brand = findDashboardBrand(data, brandId);
  const products = brandCategories(brand).flatMap((category: any) => categoryProducts(category, locale));
  const unique = new Map<string, any>();

  products.forEach((relation: any) => {
    const product = relation?.product;
    if (
      !product?.id ||
      product.id === currentProductId ||
      String(product.typeId) !== String(typeId)
    ) {
      return;
    }
    unique.set(product.id, product);
  });

  return Array.from(unique.values()).sort((a, b) => {
    const productNumber = numberValue(a?.number) - numberValue(b?.number);
    if (productNumber !== 0) return productNumber;
    return localizedName(a, locale).localeCompare(localizedName(b, locale), locale);
  });
}
