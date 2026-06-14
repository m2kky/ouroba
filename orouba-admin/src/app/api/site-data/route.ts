import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

import { NextRequest } from "next/server";

/**
 * GET /api/site-data
 * 
 * Aggregated endpoint that returns ALL data needed for the public frontend
 * in a single request. This is the primary endpoint consumed by the website
 * and future mobile apps.
 * 
 * This replaces the old Laravel fetchSiteData() pattern.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const localeParam = searchParams.get("locale");
    const referer = request.headers.get("referer") || "";
    const isEn = localeParam === "en" || referer.includes("/en/") || referer.endsWith("/en");

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
      rawRecipes,
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
      prisma.certificate.findMany({ where: { isHidden: false }, orderBy: { createdAt: "desc" } }),
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
        include: { images: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sectionText.findMany({ where: { isHidden: false }, orderBy: { number: "asc" } })
    ]);

    // Sort category products by number (asc) first, then alphabetically (asc) based on active locale
    brands.forEach((brand: any) => {
      brand.categories.forEach((category: any) => {
        if (category.products) {
          category.products.sort((a: any, b: any) => {
            const numA = a.product?.number ?? 999;
            const numB = b.product?.number ?? 999;
            if (numA !== numB) {
              return numA - numB;
            }
            const nameA = (isEn ? a.product?.nameEn : a.product?.nameAr) || "";
            const nameB = (isEn ? b.product?.nameEn : b.product?.nameAr) || "";
            return nameA.localeCompare(nameB, isEn ? "en" : "ar");
          });
        }
      });
    });

    // Transform settings to key-value map
    const settings = siteSettings.reduce((acc: Record<string, { en: string | null; ar: string | null }>, s: { key: string; valueEn: string | null; valueAr: string | null }) => {
      acc[s.key] = { en: s.valueEn, ar: s.valueAr };
      return acc;
    }, {});

    const firstExisting = (keys: string[]) => keys.map((key) => settings[key]).find(Boolean);
    const alias = (target: string, sources: string[]) => {
      if (!settings[target]) {
        const source = firstExisting(sources);
        if (source) settings[target] = source;
      }
    };
    const languagePair = (target: string, arKey = `${target}_ar`, enKey = `${target}_en`) => {
      if (settings[target]) return;
      const ar = settings[arKey]?.ar || settings[arKey]?.en || null;
      const en = settings[enKey]?.en || settings[enKey]?.ar || null;
      if (ar || en) settings[target] = { ar, en };
    };

    [
      "site_name",
      "vision",
      "world_text",
      "export_world",
      "certification_text",
      "catalog",
      "why_choose",
      "how_we_are",
      "production_steps",
      "quotation",
      "product_type_text",
      "stander",
      "purposal",
      "why_orouba",
      "copy_right",
    ].forEach((key) => languagePair(key));

    // Ensure aliases for old Laravel siteinfo fields and current frontend names.
    alias("site_title", ["site_name"]);
    alias("main_logo", ["logo"]);
    alias("favicon_logo", ["logo", "main_logo"]);
    alias("location", ["address", "location"]);
    alias("address", ["location", "address"]);
    alias("phone_1", ["service_phone", "phone"]);
    alias("phone", ["phone_1", "service_phone"]);
    alias("phone_2", ["phone"]);
    alias("home_vision_image", ["vision_image", "hero_img"]);
    alias("home_vision_text", ["vision"]);
    alias("home_why_image", ["why_orouba_img", "why_choose_img"]);
    alias("home_why_text", ["why_orouba"]);
    alias("home_world_image", ["map"]);
    alias("home_world_text", ["world_text", "export_world"]);
    alias("home_standards_text", ["stander"]);
    alias("about_production_note", ["quotation"]);
    alias("product_type_text", ["product_type_text"]);
    alias("exportDescription", ["export_world"]);
    alias("exportMap", ["map", "home_world_image"]);
    alias("exportStandardsText", ["stander", "home_standards_text"]);
    alias("catalogImage", ["catalog_image"]);
    alias("catalogFile", ["catalog_file"]);
    languagePair("catalogText", "catalogAr", "catalogEn");
    alias("catalogText", ["catalog"]);
    alias("certificationText", ["certification_text"]);
    alias("copyrightText", ["copy_right"]);

    const homeRecipeOrderValue =
      settings.home_recommended_recipe_order?.en ||
      settings.home_recommended_recipe_order?.ar ||
      "";
    const homeRecipeOrderIds = homeRecipeOrderValue
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const recipesById = new Map(rawRecipes.map((recipe: any) => [recipe.id, recipe]));
    const recipes = homeRecipeOrderIds.length
      ? homeRecipeOrderIds
          .map((id) => recipesById.get(id))
          .filter(Boolean)
          .slice(0, 6)
      : rawRecipes.slice(0, 6);

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
