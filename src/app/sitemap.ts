import { MetadataRoute } from "next";
import { RUBRICS } from "@/lib/types";
import { getRegions, getRecentNewsList } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  // 1. Static Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/terbaru`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/terpopuler`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/daerah`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/informasi/susunan-redaksi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/informasi/pedoman-media-siber`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/informasi/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Category Pages (NO word rubrik in URL or logic)
  const categoryPages: MetadataRoute.Sitemap = RUBRICS.map((rubric) => ({
    url: `${siteUrl}/${rubric.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.85,
  }));

  // 3. District / Region Pages
  let regionPages: MetadataRoute.Sitemap = [];
  try {
    const regions = await getRegions();
    if (regions && regions.length > 0) {
      regionPages = regions.map((reg) => ({
        url: `${siteUrl}/daerah/${reg.idkab}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }));
    }
  } catch {
    // Graceful fallback
  }

  // 4. Latest News Articles
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await getRecentNewsList({ page: 1, limit: 100 });
    if (articles && articles.length > 0) {
      articlePages = articles.map((art) => ({
        url: `${siteUrl}/read/${art.idart}/${art.public_slug || art.slug || "berita"}`,
        lastModified: art.tanggal ? new Date(art.tanggal) : new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      }));
    }
  } catch {
    // Graceful fallback
  }

  return [...staticPages, ...categoryPages, ...regionPages, ...articlePages];
}
