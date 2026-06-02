import ExportView from "@/views/Export/Export";
import { db } from "@/db";
import { resolveMediaTree } from "@/utils/media";

type ExportData = {
  siteinfo: Record<string, string | null | undefined>;
  continents: unknown[];
  standers: unknown[];
  certifications: unknown[];
};

async function getExportData(): Promise<ExportData> {
  const siteinfo: ExportData["siteinfo"] = {};

  try {
    const settings = await db.query.siteSettings.findMany();
    settings.forEach((setting) => {
      siteinfo[setting.key] = setting.valueEn;
      siteinfo[`${setting.key}Ar`] = setting.valueAr;
      siteinfo[`${setting.key}En`] = setting.valueEn;
    });
  } catch {
    return {
      siteinfo,
      continents: [],
      standers: [],
      certifications: [],
    };
  }

  try {
    const [continents, standers, certifications] = await Promise.all([
      db.query.exportContinents.findMany({
        orderBy: (continents, { asc }) => [asc(continents.number)],
      }),
      db.query.exportStandards.findMany({
        orderBy: (standers, { asc }) => [asc(standers.number)],
      }),
      db.query.certificates.findMany(),
    ]);

    return {
      siteinfo,
      continents,
      standers,
      certifications,
    };
  } catch {
    return {
      siteinfo,
      continents: [],
      standers: [],
      certifications: [],
    };
  }
}

export default async function ExportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const exportPageData = await getExportData();

  return <ExportView exportPage={resolveMediaTree(exportPageData)} />;
}
