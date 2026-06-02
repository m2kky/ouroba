import { R2_MEDIA_MAP, R2_MEDIA_PUBLIC_URL } from "../data/r2MediaMap";

const STORAGE_MEDIA_MARKERS = [
  "/storage/app/images/",
  "oroubafoods.com/static/media/",
];

const encodeR2Key = (key) => key.split("/").map(encodeURIComponent).join("/");

const getBasename = (value) => {
  try {
    const url = new URL(value);
    return decodeURIComponent(url.pathname.split("/").pop() || "");
  } catch {
    return decodeURIComponent(String(value).split("?")[0].split("/").pop() || "");
  }
};

const getStem = (name) => name.replace(/\.[^.]+$/, "").trim();

const isVideo = (value) => /\.(mp4|webm|mov|m4v)$/i.test(value);

const normalizeStem = (stem) =>
  stem.replace(/\s+/g, " ").replace(/-\(\d+\)$/i, "").trim();

const mediaLookupKeys = (source) => {
  const basename = getBasename(source);
  const stem = getStem(basename);
  const normalized = normalizeStem(stem);

  return [
    stem,
    normalized,
    stem.replace(/\s+/g, "-"),
    normalized.replace(/\s+/g, "-"),
  ].filter(Boolean);
};

export const resolveMediaUrl = (source) => {
  if (typeof source !== "string" || !source.trim()) {
    return source;
  }

  const trimmed = source.trim();
  if (trimmed.startsWith(R2_MEDIA_PUBLIC_URL)) {
    return trimmed;
  }

  const shouldLookup = STORAGE_MEDIA_MARKERS.some((marker) =>
    trimmed.includes(marker)
  );

  if (!shouldLookup) {
    return trimmed;
  }

  const sourceIsVideo = isVideo(getBasename(trimmed));
  const r2Key = mediaLookupKeys(trimmed)
    .map((key) => R2_MEDIA_MAP[key])
    .find((key) => key && isVideo(key) === sourceIsVideo);

  return r2Key ? `${R2_MEDIA_PUBLIC_URL}${encodeR2Key(r2Key)}` : trimmed;
};

export const resolveMediaTree = (value, seen = new WeakSet()) => {
  if (typeof value === "string") {
    return resolveMediaUrl(value);
  }

  if (!value || typeof value !== "object" || value instanceof Date) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => resolveMediaTree(item, seen));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      resolveMediaTree(item, seen),
    ])
  );
};
