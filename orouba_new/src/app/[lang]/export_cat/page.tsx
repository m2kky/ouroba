import ExportCatalogView from "@/views/ExportCatalog/ExportCatalog";
import { db } from "@/db";
import { resolveMediaTree } from "@/utils/media";

export default async function ExportCatalogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetch site setting
  const settings = await db.query.siteSettings.findMany();
  const siteSetting = settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.valueEn;
    acc[`${curr.key}Ar`] = curr.valueAr;
    acc[`${curr.key}En`] = curr.valueEn;
    return acc;
  }, {});

  return <ExportCatalogView exportCatData={resolveMediaTree(siteSetting)} />;
}
