import ContactUsView from "@/views/contactUs/index";
import { db } from "@/db";
import { resolveMediaTree } from "@/utils/media";

type ContactData = {
  siteSetting: Record<string, string | null | undefined>;
  socials: unknown[];
};

async function getContactData(): Promise<ContactData> {
  const siteSetting: ContactData["siteSetting"] = {};

  try {
    const settings = await db.query.siteSettings.findMany();
    settings.forEach((setting) => {
      siteSetting[setting.key] = setting.valueEn;
      siteSetting[`${setting.key}Ar`] = setting.valueAr;
      siteSetting[`${setting.key}En`] = setting.valueEn;
    });
  } catch {
    return {
      siteSetting,
      socials: [],
    };
  }

  try {
    const socials = await db.query.socialParents.findMany({
      with: {
        socials: true,
      },
      orderBy: (parents, { asc }) => [asc(parents.number)],
    });

    return {
      siteSetting,
      socials,
    };
  } catch {
    return {
      siteSetting,
      socials: [],
    };
  }
}

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const { siteSetting, socials } = await getContactData();

  return <ContactUsView data={resolveMediaTree(siteSetting)} socials={resolveMediaTree(socials)} />;
}
