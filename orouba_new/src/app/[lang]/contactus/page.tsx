import ContactUsView from "@/views/contactUs/index";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";

export const dynamic = "force-dynamic";

type ContactData = {
  siteSetting: Record<string, string>;
  socials: unknown[];
};

type SocialRecord = {
  parentId?: string | null;
  [key: string]: unknown;
};

type SocialParentRecord = {
  id?: string | null;
  [key: string]: unknown;
};

async function getContactData(locale: string): Promise<ContactData> {
  try {
    const data = await getDashboardSiteData(locale);
    const socials = Array.isArray(data.socials)
      ? (data.socials as SocialRecord[])
      : [];
    const parents = Array.isArray(data.socialParents)
      ? (data.socialParents as SocialParentRecord[])
      : [];

    return {
      siteSetting: dashboardSettingsToSiteinfo(data.settings, locale),
      socials: parents.map((parent) => ({
        ...parent,
        socials: socials.filter((social) => social?.parentId === parent?.id),
      })),
    };
  } catch {
    return {
      siteSetting: {},
      socials: [],
    };
  }
}

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { siteSetting, socials } = await getContactData(lang);

  return <ContactUsView data={resolveMediaTree(siteSetting)} socials={resolveMediaTree(socials)} />;
}
