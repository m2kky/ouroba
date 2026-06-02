import { redirect } from "next/navigation";

export default async function ProductsRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/product_types`);
}
