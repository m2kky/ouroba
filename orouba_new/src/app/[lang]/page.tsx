import Home from "@/views/home";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const first = (...values: Array<string | null | undefined>) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const normalizeSiteinfo = (siteinfo: Record<string, string>) => ({
  ...siteinfo,
  vision_image: first(siteinfo.vision_image, siteinfo.home_vision_image),
  why_orouba_img: first(siteinfo.why_orouba_img, siteinfo.home_why_image),
  map: first(siteinfo.map, siteinfo.home_world_image, siteinfo.exportMap),
  world_text: first(siteinfo.world_text, siteinfo.home_world_text),
  world_text_ar: first(siteinfo.world_text_ar, siteinfo.home_world_text_ar),
  world_text_en: first(siteinfo.world_text_en, siteinfo.home_world_text_en),
});

const normalizeBanner = (banner: any) => ({
  ...banner,
  title_ar: banner?.titleAr || banner?.title_ar,
  title_en: banner?.titleEn || banner?.title_en,
  image: first(banner?.imageEn, banner?.image),
  image_en: first(banner?.image, banner?.imageEn),
  video_link: first(banner?.videoLinkEn, banner?.videoLink),
  video_link_en: first(banner?.videoLink, banner?.videoLinkEn),
  small_img: first(banner?.smallImgEn, banner?.smallImg),
  small_img_en: first(banner?.smallImg, banner?.smallImgEn),
  small_video: first(banner?.smallVideoEn, banner?.smallVideo),
  small_video_en: first(banner?.smallVideo, banner?.smallVideoEn),
});

const normalizeBrand = (brand: any) => ({
  ...brand,
  name_ar: brand?.nameAr || brand?.name_ar,
  name_en: brand?.nameEn || brand?.name_en,
});

const normalizeStandard = (standard: any) => ({
  ...standard,
  description_ar: standard?.descriptionAr || standard?.description_ar,
  description_en: standard?.descriptionEn || standard?.description_en,
});

const normalizeRecipe = (recipe: any) => ({
  ...recipe,
  name_ar: recipe?.nameAr || recipe?.name_ar,
  name_en: recipe?.nameEn || recipe?.name_en,
  internal_image: recipe?.internalImage || recipe?.internal_image,
  video_link: recipe?.videoLink || recipe?.video_link,
});

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  let data: Awaited<ReturnType<typeof getDashboardSiteData>> = {};
  try {
    data = await getDashboardSiteData(lang);
  } catch {
    data = {};
  }
  const siteinfo = normalizeSiteinfo(dashboardSettingsToSiteinfo(data.settings, lang));

  const homePageData = {
    banners: (Array.isArray(data.banners) ? data.banners : []).map(normalizeBanner),
    brands: (Array.isArray(data.brands) ? data.brands : []).map(normalizeBrand),
    lastRecipess: (Array.isArray(data.recipes) ? data.recipes : []).map(normalizeRecipe),
    siteinfo,
    standers: (Array.isArray(data.standards) ? data.standards : []).map(normalizeStandard),
  };

  return <Home homePageData={resolveMediaTree(homePageData)} />;
}
