import ContactUsView from "@/views/contactUs/index";
import type { Metadata } from "next";
import {
  dashboardSettingsToSiteinfo,
  getDashboardSiteData,
} from "@/lib/dashboard-data";
import { resolveMediaTree } from "@/utils/media";
import { firstText, staticPageMetadata } from "@/lib/seo";
import { mergeDashboardSocialLinks } from "@/utils/socialLinks";

export const revalidate = 300;

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
    const siteSetting = dashboardSettingsToSiteinfo(data.settings, locale);
    const socialParents = parents.map((parent) => ({
      ...parent,
      socials: socials.filter((social) => social?.parentId === parent?.id),
    }));

    return {
      siteSetting,
      socials: mergeDashboardSocialLinks(socialParents, siteSetting),
    };
  } catch {
    return {
      siteSetting: {},
      socials: [],
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { siteSetting } = await getContactData(lang);

  return staticPageMetadata(lang, "contact", {
    description: firstText(siteSetting.location, siteSetting.location_ar, siteSetting.location_en),
    image: firstText(
      siteSetting.contact_image,
      siteSetting.contact_us_image,
      siteSetting.logo,
      "/static/media/contactUsImage.bc7db8fa7afd7e28c313.png"
    ),
  });
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
