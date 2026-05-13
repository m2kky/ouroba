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
  
  // Intercept and rewrite legacy DB full URLs to R2 bucket
  if (url.includes("camp-coding.site/eloroba/storage/app/images/")) {
    let filename = url.split('/').pop();
    // Convert extension to .webp since we are converting all images
    if (filename) {
      filename = filename.replace(/\.(png|jpe?g)$/i, '.webp');
    }
    return `${r2Url}/${filename}`;
  }

  if (url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }
  
  if (url.startsWith("/")) {
    // If it's a local upload, redirect it to R2 to use the optimized WebP images
    if (url.startsWith("/uploads/images/")) {
      let filename = url.split('/').pop();
      if (filename) {
        filename = filename.replace(/\.(png|jpe?g)$/i, '.webp');
      }
      return `${r2Url}/${filename}`;
    }
    return url;
  }
  
  // If it's a relative path, prefix with R2 URL or legacy URL
  if (r2Url) {
    return `${r2Url}/${url}`;
  }
  
  return `https://pub-0aa6a0d8dfd847389f78cd7e6b6b93bf.r2.dev/${url}`;
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
