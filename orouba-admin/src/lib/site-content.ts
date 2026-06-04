export type Locale = "ar" | "en";

export type LocalizedSetting = {
  en?: string | null;
  ar?: string | null;
};

export type SettingsMap = Record<string, LocalizedSetting | undefined>;

function clean(value: string | null | undefined): string {
  return (value || "").trim();
}

function fromSetting(setting: LocalizedSetting | undefined, locale: Locale): string {
  if (!setting) return "";
  return locale === "en"
    ? clean(setting.en) || clean(setting.ar)
    : clean(setting.ar) || clean(setting.en);
}

export function localizedSetting(
  settings: SettingsMap | null | undefined,
  locale: Locale,
  keys: string | string[],
  fallback = ""
): string {
  if (!settings) return fallback;

  const keyList = Array.isArray(keys) ? keys : [keys];
  const languageSuffix = locale === "en" ? "_en" : "_ar";
  const oppositeSuffix = locale === "en" ? "_ar" : "_en";

  for (const key of keyList) {
    const direct = fromSetting(settings[key], locale);
    if (direct) return direct;

    const localizedKey = fromSetting(settings[`${key}${languageSuffix}`], locale);
    if (localizedKey) return localizedKey;

    const oppositeKey = fromSetting(settings[`${key}${oppositeSuffix}`], locale);
    if (oppositeKey) return oppositeKey;
  }

  return fallback;
}

export function localize(locale: Locale, ar?: string | null, en?: string | null): string {
  return locale === "en" ? clean(en) || clean(ar) : clean(ar) || clean(en);
}
