import { cookies } from "next/headers";

export type Locale = "ar" | "en";

/**
 * Get the current locale on the server side.
 * Reads from the "preferred-locale" cookie set by the client-side locale context.
 * Falls back to "ar" if no cookie is set.
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value;
  return (locale === "en" ? "en" : "ar") as Locale;
}

/**
 * Helper to pick the right translation based on locale.
 */
export function t(locale: Locale, ar: string | null | undefined, en: string | null | undefined): string {
  if (locale === "en") return en || ar || "";
  return ar || en || "";
}
