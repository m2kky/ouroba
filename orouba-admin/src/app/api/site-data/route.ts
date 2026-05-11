import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

/**
 * GET /api/site-data
 * 
 * Aggregated endpoint that returns ALL data needed for the public frontend
 * in a single request. This is the primary endpoint consumed by the website
 * and future mobile apps.
 * 
 * This replaces the old Laravel fetchSiteData() pattern.
 */
export async function GET() {
  try {
    const [
      brands,
      banners,
      certificates,
      standards,
      values,
      whyChooseUs,
      buildings,
      features,
      continents,
      productionSteps,
      siteSettings,
      socials,
      socialParents,
      recipeCategories,
      categoryTypes,
      recipes,
      sectionTexts,
    ] = await Promise.all([
      prisma.brand.findMany({
        where: { isHidden: false },
        orderBy: { number: "asc" },
        include: {
          categories: {
            where: { isHidden: false },
            orderBy: { number: "asc" },
            include: {
              products: {
                where: { isHidden: false },
                include: {
                  product: {
                    include: { images: true, type: true },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.banner.findMany({ where: { isHidden: false }, orderBy: { number: "asc" } }),
      prisma.certificate.findMany({ where: { isHidden: false } }),
      prisma.standard.findMany({ where: { isHidden: false } }),
      prisma.value.findMany({ where: { isHidden: false } }),
      prisma.whyChooseUs.findMany({ where: { isHidden: false } }),
      prisma.building.findMany({ where: { isHidden: false } }),
      prisma.feature.findMany({ where: { isHidden: false } }),
      prisma.continent.findMany({
        where: { isHidden: false },
        include: { countries: { where: { isHidden: false } } },
      }),
      prisma.productionStep.findMany({ where: { isHidden: false }, orderBy: { number: "asc" } }),
      prisma.siteSetting.findMany(),
      prisma.social.findMany({ where: { isHidden: false } }),
      prisma.socialParent.findMany(),
      prisma.recipeCategory.findMany({
        where: { isHidden: false },
        orderBy: { number: "asc" },
        include: { foods: { include: { food: true } } },
      }),
      prisma.categoryType.findMany({
        where: { isHidden: false },
        orderBy: { number: "asc" },
        include: {
          categories: {
            include: { category: { include: { brand: true } } },
          },
        },
      }),
      prisma.recipe.findMany({
        where: { isHidden: false },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.sectionText.findMany({ where: { isHidden: false }, orderBy: { number: "asc" } })
    ]);

    // Transform settings to key-value map
    const settings = siteSettings.reduce((acc: Record<string, { en: string | null; ar: string | null }>, s: { key: string; valueEn: string | null; valueAr: string | null }) => {
      acc[s.key] = { en: s.valueEn, ar: s.valueAr };
      return acc;
    }, {});

    return apiSuccess({
      brands,
      banners,
      certificates,
      standards,
      values,
      whyChooseUs,
      buildings,
      features,
      continents,
      productionSteps,
      settings,
      socials,
      socialParents,
      recipeCategories,
      categoryTypes,
      recipes,
      sectionTexts,
    });
  } catch (error) {
    console.error("site-data error:", error);
    return apiError("Failed to fetch site data", 500);
  }
}
