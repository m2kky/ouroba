import { redirect } from "next/navigation";

export default async function CategoryTypesRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin/types`);
}
