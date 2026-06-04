import { redirect } from "next/navigation";

export default async function CertificationsAliasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/about/certifications`);
}
