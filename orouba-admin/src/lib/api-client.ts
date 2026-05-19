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

  // Extract the filename from the URL, regardless of what domain or path it had before
  let filename = url.split('/').pop();
  
  if (filename) {
    // Strip query params if any
    filename = filename.split('?')[0];
    
    return `${r2Url}/${filename}`;
  }
  
  return url;
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
