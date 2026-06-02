import WhoWeAreView from "@/views/WhoWeAre/WhoWeAre";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

type AboutData = {
  sections: unknown[];
  buildings: unknown[];
  productionSteps: unknown[];
  features: unknown[];
  siteInfo: Record<string, string | null | undefined>;
};

const emptyAboutData: AboutData = {
  sections: [],
  buildings: [],
  productionSteps: [],
  features: [],
  siteInfo: {},
};

async function getAboutData(): Promise<AboutData> {
  try {
    const settingsKeys = [
      "small_about_img",
      "about_image",
      "quotation_en",
      "quotation_ar",
    ];

    const [sections, buildings, productionSteps, features, settingsData] =
      await Promise.all([
        db.query.aboutSections.findMany({
          orderBy: (sections, { asc }) => [asc(sections.number)],
        }),
        db.query.aboutBuildings.findMany({
          orderBy: (buildings, { asc }) => [asc(buildings.number)],
        }),
        db.query.aboutProductionSteps.findMany({
          orderBy: (steps, { asc }) => [asc(steps.number)],
        }),
        db.query.aboutFeatures.findMany({
          orderBy: (features, { asc }) => [asc(features.number)],
        }),
        db.query.siteSettings.findMany({
          where: inArray(siteSettings.key, settingsKeys),
        }),
      ]);

    const siteInfo: AboutData["siteInfo"] = {};
    settingsData.forEach((setting) => {
      siteInfo[setting.key] = setting.valueEn || setting.valueAr;
    });

    return {
      sections,
      buildings,
      productionSteps,
      features,
      siteInfo,
    };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return emptyAboutData;
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const aboutData = await getAboutData();

  return <WhoWeAreView aboutData={resolveMediaTree(aboutData)} />;
}
