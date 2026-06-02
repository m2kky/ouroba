import Home from "@/views/home";
import { db } from "@/db";
import { banners, brands, recipes } from "@/db/schema";
import { asc } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

const HOME_PAGE_API =
  "https://camp-coding.site/eloroba/api/pages/get_home_page";

async function getRemoteHomePageData() {
  try {
    const response = await fetch(HOME_PAGE_API, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const remoteHomePageData = await getRemoteHomePageData();

  if (remoteHomePageData) {
    return <Home homePageData={resolveMediaTree(remoteHomePageData)} />;
  }

  const allBanners = await db.select().from(banners).orderBy(asc(banners.number));
  const allBrands = await db.select().from(brands).orderBy(asc(brands.number));
  const settings = await db.query.siteSettings.findMany();
  const latestRecipes = await db.query.recipes.findMany({
    orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    limit: 5,
    with: {
      images: true,
    },
  });

  const siteinfo: Record<string, string | null> = {};
  settings.forEach((setting) => {
    siteinfo[setting.key] = setting.valueEn || setting.valueAr;
  });

  const homePageData = {
    banners: allBanners.map((banner) => ({
      ...banner,
      title_ar: banner.titleAr,
      title_en: banner.titleEn,
      image_en: banner.imageEn,
      video_link: banner.videoLink,
      video_link_en: banner.videoLinkEn,
      small_img: banner.smallImg,
      small_img_en: banner.smallImgEn,
      small_video: banner.smallVideo,
      small_video_en: banner.smallVideoEn,
      hidden: banner.isHidden ? 1 : 0,
    })),
    brands: allBrands.map((brand) => ({
      ...brand,
      name_ar: brand.nameAr,
      name_en: brand.nameEn,
    })),
    lastRecipess: latestRecipes.map((recipe) => ({
      ...recipe,
      name_ar: recipe.nameAr,
      name_en: recipe.nameEn,
    })),
    siteinfo,
    standers: [],
  };

  return <Home homePageData={resolveMediaTree(homePageData)} />;
}
