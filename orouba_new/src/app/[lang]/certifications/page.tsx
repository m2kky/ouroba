import CertificationsView from "@/views/Certifications/Certifications";
import type { Metadata } from "next";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { firstText, staticPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CertificationsData = {
  certifications: unknown[];
  values: unknown[];
  siteinfo: Record<string, string>;
};

async function getCertificationsData(locale: string): Promise<CertificationsData> {
  try {
    const data = await getDashboardSiteData(locale);

    return {
      certifications: Array.isArray(data.certificates) ? data.certificates : [],
      values: Array.isArray(data.values) ? data.values : [],
      siteinfo: dashboardSettingsToSiteinfo(data.settings, locale),
    };
  } catch {
    return {
      certifications: [],
      values: [],
      siteinfo: {},
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const certPageData = await getCertificationsData(lang);
  const isArabic = lang !== "en";

  return staticPageMetadata(lang, "certifications", {
    description: firstText(
      isArabic
        ? certPageData.siteinfo.certification_text_ar
        : certPageData.siteinfo.certification_text_en
    ),
    image: firstText(
      (certPageData.certifications[0] as Record<string, unknown> | undefined)?.image,
      certPageData.siteinfo.certification_image,
      certPageData.siteinfo.logo
    ),
  });
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const certPageData = await getCertificationsData(lang);

  return <CertificationsView certPageData={resolveMediaTree(certPageData)} />;
}
