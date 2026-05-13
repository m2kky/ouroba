// src/lib/api-client.ts

function getBaseUrl(): string {
  // In production, use the configured site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Coolify/Docker: use internal container URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  // Fallback for local development
  return "http://localhost:3000";
}

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
    return url;
  }
  
  // If it's a relative path, prefix with R2 URL or legacy URL
  const r2Url = process.env.NEXT_PUBLIC_R2_URL || process.env.R2_PUBLIC_URL;
  if (r2Url) {
    return `${r2Url}/${url}`;
  }
  
  return `https://camp-coding.site/eloroba/${url}`;
}

export async function getSiteData() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/site-data`, {
    cache: "no-store", // For active development so we see changes instantly
  });
  
  if (!res.ok) {
    console.error(`[getSiteData] Failed: ${res.status} ${res.statusText} from ${baseUrl}`);
    throw new Error(`Failed to fetch site data (${res.status})`);
  }
  
  const json = await res.json();
  return json.data;
}
