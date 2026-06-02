import { redirect } from "next/navigation";

export default async function BrandsRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // Redirect to the first brand (Basma) by default
  redirect(`/${lang}/brands/5`);
}
