import CertificationsView from "@/views/Certifications/Certifications";
import { resolveMediaTree } from "@/utils/media";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";

export const revalidate = 300;

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

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const certPageData = await getCertificationsData(lang);

  return <CertificationsView certPageData={resolveMediaTree(certPageData)} />;
}
