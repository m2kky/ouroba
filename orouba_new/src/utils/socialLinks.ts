type SiteInfo = Record<string, string | null | undefined>;

type SocialItem = {
  id?: string | null;
  parentId?: string | null;
  image?: string | null;
  link?: string | null;
  isHidden?: boolean;
  type?: string;
  [key: string]: unknown;
};

type SocialParent = {
  id?: string | null;
  image?: string | null;
  socials?: SocialItem[];
  [key: string]: unknown;
};

const firstText = (...values: Array<string | null | undefined>) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim() || "";

const iconDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const SOCIAL_ICONS = {
  facebook: iconDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path d="M14.5 12h-2v7h-3v-7H8V9.5h1.5V7.86C9.5 5.74 10.66 4.5 12.83 4.5c1.04 0 2.13.19 2.13.19v2.33h-1.2c-1.13 0-1.48.7-1.48 1.42V10h2.62l-.4 2z" fill="#fff"/></svg>`
  ),
  instagram: iconDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><radialGradient id="g" cx="30%" cy="107%" r="130%"><stop offset="0%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="5" fill="url(#g)"/><path fill="#fff" d="M12 7.8A4.2 4.2 0 1 0 12 16.2 4.2 4.2 0 0 0 12 7.8Zm0 6.9a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm4.45-7.1a.98.98 0 1 1-1.96 0 .98.98 0 0 1 1.96 0ZM19.2 8.6c-.07-1.48-.41-2.8-1.49-3.88-1.08-1.08-2.4-1.42-3.88-1.49-1.52-.08-3.03-.08-4.55 0-1.48.07-2.8.41-3.88 1.49-1.08 1.08-1.42 2.4-1.49 3.88-.08 1.52-.08 3.03 0 4.55.07 1.48.41 2.8 1.49 3.88 1.08 1.08 2.4 1.42 3.88 1.49 1.52.08 3.03.08 4.55 0 1.48-.07 2.8-.41 3.88-1.49 1.08-1.08 1.42-2.4 1.49-3.88.08-1.52.08-3.03 0-4.55Zm-1.7 6.18a2.8 2.8 0 0 1-1.57 1.57c-1.08.43-3.65.33-4.93.33s-3.85.1-4.93-.33a2.8 2.8 0 0 1-1.57-1.57c-.43-1.08-.33-3.65-.33-4.93s-.1-3.85.33-4.93a2.8 2.8 0 0 1 1.57-1.57c1.08-.43 3.65-.33 4.93-.33s3.85-.1 4.93.33a2.8 2.8 0 0 1 1.57 1.57c.43 1.08.33 3.65.33 4.93s.1 3.85-.33 4.93Z"/></svg>`
  ),
};

const normalizeUrl = (url: string | null | undefined) =>
  (url || "").trim().replace(/\/+$/, "").toLowerCase();

const socialTypeFromLink = (link: string | null | undefined) => {
  const url = normalizeUrl(link);
  if (url.includes("facebook.com") || url.includes("fb.com")) return "facebook";
  if (url.includes("instagram.com")) return "instagram";
  return "";
};

export const dashboardSettingSocials = (siteinfo: SiteInfo): SocialItem[] => {
  const facebookUrl = firstText(
    siteinfo.facebook_url,
    siteinfo.facebookUrl,
    siteinfo.facebook_url_ar,
    siteinfo.facebook_url_en,
    siteinfo.facebookUrlAr,
    siteinfo.facebookUrlEn
  );
  const instagramUrl = firstText(
    siteinfo.instagram_url,
    siteinfo.instagramUrl,
    siteinfo.instagram_url_ar,
    siteinfo.instagram_url_en,
    siteinfo.instagramUrlAr,
    siteinfo.instagramUrlEn
  );

  return [
    facebookUrl
      ? {
          id: "dashboard-facebook-url",
          type: "facebook",
          link: facebookUrl,
          image: SOCIAL_ICONS.facebook,
          isHidden: false,
        }
      : null,
    instagramUrl
      ? {
          id: "dashboard-instagram-url",
          type: "instagram",
          link: instagramUrl,
          image: SOCIAL_ICONS.instagram,
          isHidden: false,
        }
      : null,
  ].filter(Boolean) as SocialItem[];
};

export const mergeDashboardSocialLinks = (
  socialParents: SocialParent[] = [],
  siteinfo: SiteInfo = {}
) => {
  const settingSocials = dashboardSettingSocials(siteinfo);
  if (!settingSocials.length) return socialParents;

  const settingsByType = new Map(settingSocials.map((item) => [item.type, item]));
  const replacedTypes = new Set<string | undefined>();
  const updatedParents = socialParents
    .map((parent) => ({
      ...parent,
      socials: (parent.socials || []).map((social) => {
        const type = social.type || socialTypeFromLink(social.link);
        const settingSocial = settingsByType.get(type);
        if (!settingSocial?.link) return social;

        replacedTypes.add(type);
        return {
          ...social,
          type,
          link: settingSocial.link,
        };
      }),
    }))
    .filter((parent) => parent.socials && parent.socials.length);
  const missingSettingSocials = settingSocials.filter((social) => !replacedTypes.has(social.type));

  return [
    ...updatedParents,
    ...(missingSettingSocials.length
      ? [
          {
            id: "dashboard-social-links",
            socials: missingSettingSocials,
          },
        ]
      : []),
  ];
};
