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
  
  // Safe fallback to the hardcoded R2 URL for client-side rendering where non-NEXT_PUBLIC env vars are undefined
  const r2Url = process.env.NEXT_PUBLIC_R2_URL || process.env.R2_PUBLIC_URL || "https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev";
  
  if (url.startsWith("data:")) {
    return url;
  }

  // If the url is already an absolute R2 URL, return it as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const isR2Host = url.includes("pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev") || 
                     (process.env.NEXT_PUBLIC_R2_URL && url.includes(process.env.NEXT_PUBLIC_R2_URL.replace(/^https?:\/\//, "")));
    if (isR2Host) {
      return url;
    }
    
    // For legacy URLs from camp-coding.site:
    const filename = url.split('/').pop()?.split('?')[0];
    if (filename) {
      if (url.includes("/storage/app/images/")) {
        return `${r2Url}/products/${filename}`;
      }
      return `${r2Url}/${filename}`;
    }
  }

  // If it's a relative path like "brands/abc.webp" or "products/xyz.webp", prepend R2 base URL
  if (url.includes("/")) {
    const cleanPath = url.startsWith("/") ? url.substring(1) : url;
    return `${r2Url}/${cleanPath}`;
  }

  // Default fallback
  return `${r2Url}/${url}`;
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
