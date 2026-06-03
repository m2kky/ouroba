import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema';
import { inArray } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const queryClient = postgres(process.env.DATABASE_URL!);
  const db = drizzle(queryClient, { schema });
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
        db.query.aboutBuildings.findMany(),
        db.query.aboutProductionSteps.findMany({
          orderBy: (steps, { asc }) => [asc(steps.number)],
        }),
        db.query.aboutFeatures.findMany(),
        db.query.siteSettings.findMany({
          where: inArray(schema.siteSettings.key, settingsKeys),
        }),
      ]);

    console.log("Success!");
    console.log("sections:", sections.length);
    console.log("buildings:", buildings.length);
    console.log("steps:", productionSteps.length);
    console.log("features:", features.length);
    console.log("settings:", settingsData.length);
  } catch (error) {
    console.error("ERROR:", error);
  }
  process.exit(0);
}
run();
