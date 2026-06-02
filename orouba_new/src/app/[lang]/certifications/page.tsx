import CertificationsView from "@/views/Certifications/Certifications";
import { db } from "@/db";
import { resolveMediaTree } from "@/utils/media";

type CertificationsData = {
  certifications: unknown[];
  values: unknown[];
};

async function getCertificationsData(): Promise<CertificationsData> {
  try {
    const [certifications, values] = await Promise.all([
      db.query.certificates.findMany(),
      db.query.certificateValues.findMany({
        orderBy: (values, { asc }) => [asc(values.number)],
      }),
    ]);

    return {
      certifications,
      values,
    };
  } catch {
    return {
      certifications: [],
      values: [],
    };
  }
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const certPageData = await getCertificationsData();

  return <CertificationsView certPageData={resolveMediaTree(certPageData)} />;
}
