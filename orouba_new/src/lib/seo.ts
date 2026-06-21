import type { Metadata } from "next";
import { resolveMediaUrl } from "@/utils/media";

export type SeoLocale = "ar" | "en";

type StaticPageKey =
  | "home"
  | "about"
  | "certifications"
  | "productTypes"
  | "export"
  | "exportCatalog"
  | "recipes"
  | "contact"
  | "careers";

type SeoCopy = {
  title: string;
  description: string;
  path: string;
};

type PageMetadataInput = {
  lang?: string;
  path?: string;
  title?: unknown;
  description?: unknown;
  image?: unknown;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
};

const SITE_NAME = "Orouba Foods";
const DEFAULT_SITE_URL = "https://oroubafoods.com";
const DEFAULT_OG_IMAGE = "/static/media/headerRigh1.4eaddc7ebf9f04965208.png";

const DEFAULT_KEYWORDS = {
  ar: [
    "العروبة",
    "Orouba Foods",
    "خضروات مجمدة",
    "فاكهة مجمدة",
    "منتجات غذائية مجمدة",
  ],
  en: [
    "Orouba Foods",
    "frozen vegetables",
    "frozen fruits",
    "frozen food",
    "Egyptian food manufacturer",
  ],
} satisfies Record<SeoLocale, string[]>;

const STATIC_PAGE_SEO = {
  ar: {
    home: {
      title: SITE_NAME,
      description:
        "العروبة للأغذية تقدم منتجات غذائية مجمدة عالية الجودة من الخضروات والفواكه والبقوليات والحبوب والفلافل بمكونات طبيعية.",
      path: "/",
    },
    about: {
      title: "من نحن",
      description:
        "تعرف على شركة العروبة لصناعة المواد الغذائية، مصنعها، رؤيتها، وخبرتها في إنتاج منتجات غذائية مجمدة عالية الجودة منذ 1998.",
      path: "/about",
    },
    certifications: {
      title: "الشهادات والمعايير",
      description:
        "اكتشف شهادات ومعايير الجودة التي تعكس التزام العروبة بسلامة الغذاء والجودة والتميز في التصنيع.",
      path: "/certifications",
    },
    productTypes: {
      title: "أصناف المنتجات",
      description:
        "استعرض خطوط إنتاج العروبة من الخضروات والفواكه والبقوليات والحبوب والمنتجات نصف المقلية والمجمدة.",
      path: "/product_types",
    },
    export: {
      title: "التصدير",
      description:
        "العروبة تصدر منتجاتها المجمدة عالية الجودة إلى أسواق عالمية متعددة عبر شبكة توزيع واسعة.",
      path: "/export",
    },
    exportCatalog: {
      title: "كتالوج التصدير",
      description:
        "استكشف كتالوج العروبة للتصدير ومجموعة المنتجات المجمدة والعلامات التجارية المتاحة للأسواق العالمية.",
      path: "/export_cat",
    },
    recipes: {
      title: "الوصفات",
      description:
        "وصفات متنوعة وسهلة باستخدام منتجات العروبة المجمدة لتحضير أطباق رئيسية، شوربات، مقبلات، سلطات وحلويات.",
      path: "/recipes",
    },
    contact: {
      title: "اتصل بنا",
      description:
        "تواصل مع العروبة للأغذية لمعرفة المزيد عن المنتجات، التصدير، العنوان، أرقام الهاتف وبيانات التواصل.",
      path: "/contactus",
    },
    careers: {
      title: "وظائف",
      description:
        "انضم إلى فريق العروبة للأغذية واكتشف فرص العمل المتاحة في بيئة تهتم بالنمو والتميز.",
      path: "/careers",
    },
  },
  en: {
    home: {
      title: SITE_NAME,
      description:
        "Orouba Foods produces premium frozen vegetables, fruits, beans, grains, falafel and pre-fried products made with natural ingredients.",
      path: "/",
    },
    about: {
      title: "Who We Are",
      description:
        "Learn about Orouba for Food Industries, our factory, vision and experience in producing premium frozen food products since 1998.",
      path: "/about",
    },
    certifications: {
      title: "Certifications & Standards",
      description:
        "Explore Orouba Foods certifications and quality standards for food safety, manufacturing excellence and reliable operations.",
      path: "/certifications",
    },
    productTypes: {
      title: "Product Types",
      description:
        "Browse Orouba Foods product lines, including frozen vegetables, fruits, beans, grains, pre-fried and ready-to-cook products.",
      path: "/product_types",
    },
    export: {
      title: "Export",
      description:
        "Orouba Foods exports high-quality frozen products to global markets through an extensive international network.",
      path: "/export",
    },
    exportCatalog: {
      title: "Export Catalog",
      description:
        "Explore Orouba Foods export catalog with frozen products and brands crafted for international business needs.",
      path: "/export_cat",
    },
    recipes: {
      title: "Recipes",
      description:
        "Discover easy recipes with Orouba frozen products, including main dishes, soups, appetizers, salads, desserts and drinks.",
      path: "/recipes",
    },
    contact: {
      title: "Contact Us",
      description:
        "Contact Orouba Foods for product, export and company inquiries, including address, phone numbers and social channels.",
      path: "/contactus",
    },
    careers: {
      title: "Careers",
      description:
        "Join Orouba Foods and explore career opportunities in a workplace focused on growth, quality and excellence.",
      path: "/careers",
    },
  },
} satisfies Record<SeoLocale, Record<StaticPageKey, SeoCopy>>;

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&#160;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

export const normalizeSeoLocale = (lang?: string): SeoLocale => (lang === "en" ? "en" : "ar");

export const getSiteUrl = () => {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_OROUBA_SITE_URL ||
    DEFAULT_SITE_URL;

  try {
    return new URL(configured).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export function cleanSeoText(value: unknown, maxLength = 160) {
  const raw = firstText(value);
  if (!raw) return "";

  const withoutMarkup = raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\n|\\r/g, " ");

  const decoded = Object.entries(HTML_ENTITIES).reduce(
    (text, [entity, replacement]) => text.replace(new RegExp(entity, "gi"), replacement),
    withoutMarkup
  );

  const compact = decoded.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;

  const shortened = compact.slice(0, Math.max(0, maxLength - 3)).replace(/\s+\S*$/, "");
  return `${shortened.trim()}...`;
}

export function firstText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function localizedField(
  record: Record<string, unknown> | null | undefined,
  lang: string | undefined,
  base: string
) {
  const locale = normalizeSeoLocale(lang);
  const pascalLocale = locale === "ar" ? "Ar" : "En";
  const fallbackLocale = locale === "ar" ? "en" : "ar";
  const fallbackPascal = fallbackLocale === "ar" ? "Ar" : "En";

  return firstText(
    record?.[`${base}${pascalLocale}`],
    record?.[`${base}_${locale}`],
    record?.[base],
    record?.[`${base}${fallbackPascal}`],
    record?.[`${base}_${fallbackLocale}`]
  );
}

export function resolveSeoImage(...values: unknown[]) {
  const candidate = values
    .map((value) => firstText(value))
    .filter(Boolean)
    .map((value) => resolveMediaUrl(value))
    .find((value) => typeof value === "string" && IMAGE_EXTENSION.test(value));

  return absoluteUrl(candidate || DEFAULT_OG_IMAGE);
}

export function staticPageMetadata(
  lang: string | undefined,
  key: StaticPageKey,
  overrides: Partial<PageMetadataInput> = {}
): Metadata {
  const locale = normalizeSeoLocale(lang);
  const copy = STATIC_PAGE_SEO[locale][key];

  return createPageMetadata({
    lang: locale,
    path: copy.path,
    title: overrides.title || copy.title,
    description: overrides.description || copy.description,
    image: overrides.image,
    keywords: overrides.keywords,
    noIndex: overrides.noIndex,
    type: overrides.type,
  });
}

export function createPageMetadata({
  lang,
  path = "/",
  title,
  description,
  image,
  keywords,
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const locale = normalizeSeoLocale(lang);
  const routePath = normalizeRoutePath(path);
  const pageTitle = cleanSeoText(title, 80) || STATIC_PAGE_SEO[locale].home.title;
  const seoDescription =
    cleanSeoText(description, 170) || STATIC_PAGE_SEO[locale].home.description;
  const fullTitle =
    pageTitle === SITE_NAME || pageTitle.includes(SITE_NAME)
      ? pageTitle
      : `${pageTitle} | ${SITE_NAME}`;
  const imageUrl = resolveSeoImage(image);
  const url = canonicalUrl(routePath, locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: SITE_NAME,
    title: fullTitle,
    description: seoDescription,
    keywords: keywords?.length ? keywords : DEFAULT_KEYWORDS[locale],
    alternates: {
      canonical: url,
      languages: {
        ar: canonicalUrl(routePath, "ar"),
        en: canonicalUrl(routePath, "en"),
        "x-default": canonicalUrl(routePath, "ar"),
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: seoDescription,
      url,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      type,
      images: [
        {
          url: imageUrl,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seoDescription,
      images: [imageUrl],
    },
  };
}

function absoluteUrl(value: unknown) {
  const text = firstText(value);
  const siteUrl = getSiteUrl();

  if (!text) return new URL(DEFAULT_OG_IMAGE, siteUrl).toString();
  if (/^\/\//.test(text)) return `https:${text}`;

  try {
    return new URL(text).toString();
  } catch {
    const path = text.startsWith("/") ? text : `/${text}`;
    return new URL(path, siteUrl).toString();
  }
}

function canonicalUrl(path: string, lang: SeoLocale) {
  return new URL(localizedPath(path, lang), getSiteUrl()).toString();
}

function localizedPath(path: string, lang: SeoLocale) {
  const normalized = normalizeRoutePath(path);
  return normalized === "/" ? `/${lang}` : `/${lang}${normalized}`;
}

function normalizeRoutePath(path: string) {
  const withoutLocale = firstText(path)
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/(ar|en)(?=\/|$)/i, "");
  const cleanPath = withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;

  if (!cleanPath || cleanPath === "/") return "/";
  return cleanPath.replace(/\/+$/, "");
}
