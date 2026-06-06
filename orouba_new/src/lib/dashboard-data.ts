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
  features?: unknown[];
  whyChooseUs?: unknown[];
  socials?: unknown[];
  socialParents?: unknown[];
  settings?: Record<string, DashboardSetting>;
};

const DEFAULT_DASHBOARD_URL = "https://admin1.oroubafoods.com";

export function getDashboardBaseUrl() {
  return (
    process.env.OROUBA_DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_OROUBA_DASHBOARD_URL ||
    DEFAULT_DASHBOARD_URL
  ).replace(/\/+$/, "");
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
  const url = new URL("/api/site-data", getDashboardBaseUrl());
  url.searchParams.set("locale", locale === "en" ? "en" : "ar");

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard site-data request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload?.data ?? payload ?? {};
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
