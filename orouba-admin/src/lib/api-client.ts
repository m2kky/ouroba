// src/lib/api-client.ts
export async function getSiteData() {
  const res = await fetch("http://localhost:3000/api/site-data", {
    cache: "no-store", // For active development so we see changes instantly
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch site data");
  }
  
  const json = await res.json();
  return json.data;
}
