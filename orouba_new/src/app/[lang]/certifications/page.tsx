import CertificationsView from "@/views/Certifications/Certifications";
import { db } from "@/db";
import { certificates, certificateValues } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resolveMediaTree } from "@/utils/media";

type CertificationsData = {
  certifications: unknown[];
  values: unknown[];
};

async function getCertificationsData(): Promise<CertificationsData> {
  try {
    const [certifications, values] = await Promise.all([
      db.query.certificates.findMany({
        where: eq(certificates.isHidden, false),
      }),
      db.query.certificateValues.findMany({
        where: eq(certificateValues.isHidden, false),
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
