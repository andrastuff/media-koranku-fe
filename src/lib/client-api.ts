import { Article } from "@/lib/types";

const API_PATH = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_PATH || "/koranku/api/v1";

function clientApiUrl(endpoint: string) {
  const base = API_PATH.replace(/\/+$/, "");
  const suffix = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (/^https?:\/\//i.test(base)) return `${base}${suffix}`;
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    return `${window.location.protocol}//${window.location.hostname}${base.startsWith("/") ? base : `/${base}`}${suffix}`;
  }
  return `${base}${suffix}`;
}

export async function fetchClientRegionNews(idkabOrSlug: string | number, limit = 4): Promise<Article[]> {
  try {
    const res = await fetch(clientApiUrl(`/daerah/${idkabOrSlug}/news?limit=${limit}`));
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function postComment(idart: string | number, payload: { nama: string; email: string; comment: string }): Promise<boolean> {
  try {
    const res = await fetch(clientApiUrl(`/news/${idart}/comments`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function incrementView(idart: string | number): Promise<void> {
  try {
    await fetch(clientApiUrl(`/news/${idart}/view`), { method: "POST" });
  } catch {}
}

export { clientApiUrl };
