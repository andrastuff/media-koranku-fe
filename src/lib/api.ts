import {
  ApiResponse,
  Article,
  HomeData,
  Category,
  Region,
  TagItem,
  MenuNode,
  AdItem,
  CommentItem,
  StaticPage,
  SiteMeta,
  PaginationMeta,
} from "./types";
import { headers } from "next/headers";
import { connection } from "next/server";

const API_PATH = process.env.NEXT_PUBLIC_API_PATH || "/koranku/api/v1";

async function resolveAPIBaseUrl(configured: string): Promise<string> {
  if (/^https?:\/\//i.test(configured)) return configured.replace(/\/+$/, "");

  await connection();
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "").split(",")[0].trim();
  if (!host) throw new Error("API host is unavailable. Set API_BASE_URL for build-time requests.");
  const protocol = (requestHeaders.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https")).split(",")[0].trim();
  const apiHost = process.env.NODE_ENV === "development" ? host.replace(/:\d+$/, "") : host;
  return `${protocol}://${apiHost}${configured.startsWith("/") ? configured : `/${configured}`}`.replace(/\/+$/, "");
}

async function getAPIBaseUrl(): Promise<string> {
  return resolveAPIBaseUrl(
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || API_PATH
  );
}

// URL yang dapat dibuka browser. Jangan memakai hostname internal Docker di sini.
async function getPublicAPIBaseUrl(): Promise<string> {
  return resolveAPIBaseUrl(process.env.NEXT_PUBLIC_API_URL || API_PATH);
}

async function buildAPIUrl(endpoint: string): Promise<string> {
  const base = await getAPIBaseUrl();
  return `${base}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function getAPICandidateUrls(endpoint: string): Promise<string[]> {
  const suffix = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const internalBase = await getAPIBaseUrl();
  const publicBase = await getPublicAPIBaseUrl();

  return [...new Set([internalBase, publicBase])].map((base) => `${base}${suffix}`);
}

function resolveBackendAssetUrl(assetPath: string, apiBaseUrl: string): string {
  const backendRoot = apiBaseUrl.replace(/\/(?:index\.php\/)?api\/v1\/?$/, "");
  return `${backendRoot}/${assetPath.replace(/^\/+/, "")}`;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  let lastError: unknown;

  try {
    const urls = await getAPICandidateUrls(endpoint);

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options.headers,
          },
          next: { revalidate: 60, ...options.next },
        });

        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status} from ${url}`);
          continue;
        }

        const json: ApiResponse<T> = await res.json();
        return json.data;
      } catch (err) {
        lastError = err;
      }
    }
  } catch (err) {
    lastError = err;
  }

  console.error(`[API] All endpoints failed for ${endpoint}:`, lastError);
  return null;
}

function parentArticles(articles: Article[] | null | undefined): Article[] {
  return (articles || []).filter((article) => Number(article.parent || 0) === 0);
}

// Global & Layout
export async function getSiteMeta(): Promise<SiteMeta | null> {
  const meta = await fetchAPI<SiteMeta>("/meta");

  if (meta?.logo_path) {
    const apiBaseUrl = await getPublicAPIBaseUrl();
    meta.logo_url = resolveBackendAssetUrl(meta.logo_path, apiBaseUrl);
    if (meta.footer_logo_path) {
      meta.footer_logo_url = resolveBackendAssetUrl(meta.footer_logo_path, apiBaseUrl);
    }
  }

  return meta;
}

export async function getMenus(): Promise<{ header: MenuNode[]; footer: any[] } | null> {
  return fetchAPI<{ header: MenuNode[]; footer: any[] }>("/menus");
}

export async function getAds(posisi?: string): Promise<AdItem[]> {
  const query = posisi ? `?posisi=${encodeURIComponent(posisi)}` : "";
  const res = await fetchAPI<AdItem[]>(`/ads${query}`);
  const apiBaseUrl = await getPublicAPIBaseUrl();
  return (res || []).map((ad) => ({
    ...ad,
    img_url: ad.img_path ? resolveBackendAssetUrl(ad.img_path, apiBaseUrl) : ad.img_url,
  }));
}

export async function getOnlineStats(): Promise<{ online_users: number } | null> {
  return fetchAPI<{ online_users: number }>("/stats/online-users", { cache: "no-store" });
}

// Home & News
export async function getHomeData(): Promise<HomeData | null> {
  const data = await fetchAPI<HomeData>("/home");
  if (!data) return null;

  return {
    ...data,
    headlines: parentArticles(data.headlines),
    hotnews: parentArticles(data.hotnews),
    daerah: parentArticles(data.daerah),
    popular: parentArticles(data.popular),
    recent: parentArticles(data.recent),
    categories_feed: Object.fromEntries(
      Object.entries(data.categories_feed || {}).map(([category, articles]) => [
        category,
        parentArticles(articles),
      ])
    ),
  };
}

export async function getHeadlines(limit = 5): Promise<Article[]> {
  const res = await fetchAPI<Article[]>(`/news/headlines?limit=${limit}`);
  return parentArticles(res);
}

export async function getHotnews(limit = 5): Promise<Article[]> {
  const res = await fetchAPI<Article[]>(`/news/hotnews?limit=${limit}`);
  return parentArticles(res);
}

export async function getVideos(): Promise<{ featured_youtube: AdItem[]; video_articles: Article[] } | null> {
  const data = await fetchAPI<{ featured_youtube: AdItem[]; video_articles: Article[] }>("/news/videos");
  return data ? { ...data, video_articles: parentArticles(data.video_articles) } : null;
}

export async function getNewsList(params: {
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
} = {}): Promise<{ data: Article[]; pagination?: any }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.year) query.set("year", params.year);
  if (params.month) query.set("month", params.month);

  const url = await buildAPIUrl(`/news?${query.toString()}`);
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

export async function getNewsDetail(idart: string | number): Promise<Article | null> {
  const article = await fetchAPI<Article>(`/news/detail/${idart}`, { next: { revalidate: 120 } });
  if (!article) return null;

  // Continuation parts/pages must remain available on the read page. Only the
  // related-news list is sanitized here.
  return { ...article, related: parentArticles(article.related) };
}

export async function getRelatedNews(idart: string | number, limit = 5): Promise<Article[]> {
  const res = await fetchAPI<Article[]>(`/news/${idart}/related?limit=${limit}`);
  return parentArticles(res);
}

export async function getPopularNews(limit = 6): Promise<Article[]> {
  const res = await fetchAPI<Article[]>(`/news/popular?limit=${limit}`);
  return parentArticles(res);
}

export async function getPopularNewsList(params: {
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
} = {}): Promise<{ data: Article[]; pagination?: PaginationMeta }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 12));
  if (params.year) query.set("year", params.year);
  if (params.month) query.set("month", params.month);

  try {
    const res = await fetch(await buildAPIUrl(`/news/popular?${query.toString()}`), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

export async function getRecentNews(limit = 6): Promise<Article[]> {
  const res = await fetchAPI<Article[]>(`/news/recent?limit=${limit}`);
  return parentArticles(res);
}

export async function getRecentNewsList(params: {
  page?: number;
  limit?: number;
  year?: string;
  month?: string;
} = {}): Promise<{ data: Article[]; pagination?: PaginationMeta }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 12));
  if (params.year) query.set("year", params.year);
  if (params.month) query.set("month", params.month);
  try {
    const res = await fetch(await buildAPIUrl(`/news/recent?${query.toString()}`), { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

export async function searchNews(keyword: string, page = 1, limit = 10, filters: { year?: string; month?: string } = {}): Promise<{ data: Article[]; pagination?: PaginationMeta }> {
  const query = new URLSearchParams({ q: keyword, page: page.toString(), limit: limit.toString() });
  if (filters.year) query.set("year", filters.year);
  if (filters.month) query.set("month", filters.month);
  const url = await buildAPIUrl(`/news/search?${query.toString()}`);
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

// Taxonomy
export async function getCategories(): Promise<Category[]> {
  const res = await fetchAPI<Category[]>("/categories");
  return res || [];
}

export async function getCategoryNews(
  slug: string,
  page = 1,
  limit = 10
): Promise<{ data: Article[]; pagination?: any }> {
  const url = await buildAPIUrl(`/categories/${slug}/news?page=${page}&limit=${limit}`);
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

export async function getTags(): Promise<TagItem[]> {
  const res = await fetchAPI<TagItem[]>("/tags");
  return res || [];
}

export async function getTagNews(
  slug: string,
  page = 1,
  limit = 10
): Promise<{ data: Article[]; pagination?: any }> {
  const url = await buildAPIUrl(`/tags/${slug}/news?page=${page}&limit=${limit}`);
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

export async function getRegions(): Promise<Region[]> {
  const res = await fetchAPI<Region[]>("/daerah");
  return res || [];
}

export async function getRegionNews(
  idkab: string | number,
  page = 1,
  limit = 10
): Promise<{ data: Article[]; pagination?: any }> {
  const url = await buildAPIUrl(`/daerah/${idkab}/news?page=${page}&limit=${limit}`);
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] };
    const json: ApiResponse<Article[]> = await res.json();
    return { data: parentArticles(json.data), pagination: json.pagination };
  } catch {
    return { data: [] };
  }
}

// Static Pages
export async function getStaticPages(): Promise<StaticPage[]> {
  const res = await fetchAPI<StaticPage[]>("/pages");
  return res || [];
}

export async function getStaticPageDetail(slug: string): Promise<StaticPage | null> {
  return fetchAPI<StaticPage>(`/pages/${slug}`);
}

// Comments & Interaction
export async function getComments(idart: string | number): Promise<CommentItem[]> {
  const res = await fetchAPI<CommentItem[]>(`/news/${idart}/comments`, { cache: "no-store" });
  return res || [];
}
