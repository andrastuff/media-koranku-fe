import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getRegionNews, getRegions, getPopularNews } from "@/lib/api";
import LeadStoryCard from "@/components/cards/LeadStoryCard";
import EditorialCard from "@/components/cards/EditorialCard";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import { MapPin, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";

import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ idkab: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { idkab } = await params;
  const regions = await getRegions();
  const currentRegion = regions.find((r) => String(r.idkab) === String(idkab) || r.slug === idkab);

  const regionName = currentRegion ? currentRegion.kabupaten : "Daerah";
  const title = `Berita ${regionName}`;
  const fullTitle = `${title} - korankuid`;
  const description = `Kumpulan berita ${regionName} terkini seputar pembangunan daerah, pelayanan masyarakat, hukum, dan peristiwa se-Provinsi Lampung.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  return {
    title,
    description,
    keywords: [
      `berita ${regionName.toLowerCase()}`,
      `kabar ${regionName.toLowerCase()}`,
      regionName.toLowerCase(),
      "lampung",
      "pembangunan daerah",
      "korankuid",
    ],
    alternates: {
      canonical: `/daerah/${idkab}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/daerah/${idkab}`,
      type: "website",
      locale: "id_ID",
      siteName: "korankuid",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@korankuid",
      creator: "@korankuid",
    },
  };
}

export default async function RegionDetailPage({ params, searchParams }: PageProps) {
  const { idkab } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || "1", 10) || 1;

  const [regions, { data: articles, pagination }, popular] = await Promise.all([
    getRegions(),
    getRegionNews(idkab, currentPage, 12),
    getPopularNews(5),
  ]);

  const currentRegion = regions.find((r) => String(r.idkab) === String(idkab) || r.slug === idkab);
  const regionName = currentRegion ? currentRegion.kabupaten : "Kabar Daerah";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  const leadStory = articles.length > 0 ? articles[0] : null;
  const secondaryStories = articles.length > 1 ? articles.slice(1) : [];

  const breadcrumbs = [
    { name: "Beranda", url: siteUrl },
    { name: "Kabar Daerah", url: `${siteUrl}/daerah` },
    { name: `Berita ${regionName}`, url: `${siteUrl}/daerah/${idkab}` },
  ];

  const itemList = articles.map((art, idx) => ({
    name: art.judul_artikel,
    url: `${siteUrl}/read/${art.idart}/${art.public_slug || art.slug || "berita"}`,
    image: art.img_full_url || art.img_thumb_url,
    position: idx + 1,
  }));

  return (
    <div className="py-2">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ItemListJsonLd
        name={`Berita ${regionName}`}
        description={`Kumpulan berita terkini dari ${regionName}`}
        itemList={itemList}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Navigasi remah roti" className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/daerah" className="hover:text-[#052962] font-semibold">
          Daerah
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800">{regionName}</span>
      </nav>

      {/* Header */}
      <div className="border-b-4 border-[#052962] pb-6 mb-8">
        <div className="flex items-center space-x-2 text-[#052962] mb-2">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-wider">
            Kabar Daerah
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          {regionName}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Daftar berita, kebijakan pemda, dan peristiwa terkini di wilayah {regionName}.
        </p>
      </div>

      {/* Content */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#dcdcdc] rounded-xs">
          <p className="font-serif text-lg font-bold text-gray-700 mb-2">
            Belum Ada Berita Terbaru
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Berita untuk wilayah {regionName} akan segera diperbarui oleh koresponden kami.
          </p>
          <Link
            href="/daerah"
            className="inline-block text-xs font-bold uppercase bg-[#052962] text-white px-4 py-2 rounded"
          >
            Lihat Daerah Lainnya
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <main className="lg:col-span-8 space-y-8">
            {leadStory && (
              <div className="bg-white border border-[#dcdcdc] p-5 rounded-xs">
                <LeadStoryCard article={leadStory} />
              </div>
            )}

            {secondaryStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {secondaryStories.map((story) => (
                  <div key={story.idart} className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
                    <EditorialCard
                      article={story}
                      aspectRatio="video"
                      borderRight={false}
                      borderBottom={false}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
              {currentPage > 1 ? (
                <Link
                  href={`/daerah/${idkab}?page=${currentPage - 1}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 border border-gray-300 text-xs font-bold uppercase rounded text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </Link>
              ) : (
                <div></div>
              )}

              {articles.length >= 12 ? (
                <Link
                  href={`/daerah/${idkab}?page=${currentPage + 1}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#052962] text-white text-xs font-bold uppercase rounded hover:bg-[#041f4a]"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <PopularSidebar articles={popular} />

            {/* Other Regions list */}
            <div className="bg-white border border-[#dcdcdc] p-4 rounded-xs">
              <h3 className="font-serif text-sm font-bold uppercase tracking-tight text-gray-950 pb-2 border-b border-gray-200 mb-3">
                Kabupaten / Kota Lainnya
              </h3>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {regions
                  .filter((r) => String(r.idkab) !== String(idkab))
                  .map((r) => (
                    <Link
                      key={r.idkab}
                      href={`/daerah/${r.idkab}`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-700 hover:text-[#052962] transition-colors truncate"
                    >
                      {r.kabupaten}
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
