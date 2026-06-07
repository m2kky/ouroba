export const firstText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

export const localizedText = (source, language, keys, fallback = "") => {
  const lang = language === "ar" ? "ar" : "en";
  const fallbackValue =
    fallback && typeof fallback === "object" ? fallback[lang] || fallback.en || "" : fallback;

  for (const key of keys) {
    const value =
      lang === "ar"
        ? firstText(source?.[`${key}_ar`], source?.[`${key}Ar`], source?.[key])
        : firstText(source?.[`${key}_en`], source?.[`${key}En`], source?.[key]);

    if (value) return value;
  }

  return fallbackValue;
};

export const splitHeading = (text) => {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { first: "", rest: "" };
  return {
    first: words[0],
    rest: words.slice(1).join(" "),
  };
};

export const HOME_TEXT_FALLBACKS = {
  visionTitle: {
    ar: "\u0645\u0646 \u0627\u0644\u0631\u0624\u064a\u0629 \u0625\u0644\u0649 \u0627\u0644\u0648\u0627\u0642\u0639",
    en: "From Vision to Reality",
  },
  whyTitle: {
    ar: "\u0644\u0645\u0627\u0630\u0627 \u0627\u0644\u0639\u0631\u0648\u0628\u0629 \u061f",
    en: "Why Orouba?",
  },
  whySubtitle: {
    ar: "\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0641\u0631\u0642 \u0641\u064a \u0643\u0644 \u0642\u0636\u0645\u0629:",
    en: "Discover the Difference in Every Bite:",
  },
  standardsTitle: {
    ar: "\u0645\u0639\u0627\u064a\u064a\u0631\u0646\u0627",
    en: "Our Standards",
  },
  standardsText: {
    ar: "\u0646\u0644\u062a\u0632\u0645 \u0641\u064a \u0627\u0644\u0639\u0631\u0648\u0628\u0629 \u0628\u0623\u0639\u0644\u0649 \u0645\u0639\u0627\u064a\u064a\u0631 \u0627\u0644\u062c\u0648\u062f\u0629 \u0644\u0636\u0645\u0627\u0646 \u0623\u0646 \u0643\u0644 \u0645\u0646\u062a\u062c \u0646\u0642\u062f\u0645\u0647 \u064a\u0644\u0628\u064a \u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a\u0643 \u0648\u064a\u062a\u062c\u0627\u0648\u0632 \u062a\u0648\u0642\u0639\u0627\u062a\u0643.",
    en: "At Orouba, we hold ourselves to the highest standards to ensure that every product meets your needs and exceeds your expectations.",
  },
  worldTitle: {
    ar: "\u0627\u0644\u0639\u0631\u0648\u0628\u0629 \u062d\u0648\u0644 \u0627\u0644\u0639\u0627\u0644\u0645",
    en: "Orouba Around The World",
  },
  learnMore: {
    ar: "\u0627\u0644\u0645\u0632\u064a\u062f",
    en: "Learn More",
  },
  aboutUs: {
    ar: "\u0639\u0646 \u0627\u0644\u0639\u0631\u0648\u0628\u0629",
    en: "About Us",
  },
};
