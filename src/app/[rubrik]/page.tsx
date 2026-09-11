import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RUBRICS } from "@/lib/types";
import { getCategoryNews, getPopularNews, getRecentNews } from "@/lib/api";
import LeadStoryCard from "@/components/cards/LeadStoryCard";
import EditorialGridCard from "@/components/cards/EditorialGridCard";
import SentilanCard from "@/components/cards/SentilanCard";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import LatestSidebar from "@/components/sidebar/LatestSidebar";
import SectionHeader from "@/components/ui/SectionHeader";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/JsonLd";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ rubrik: string }>;
  searchParams: Promise<{ page?: string }>;
}

function getCategoryCleanTitle(config: { name: string; slug: string }) {
  if (config.slug === "sentilan") return "Sentilan";
  if (config.slug === "opini") return "Opini & Gagasan";
  return `Berita ${config.name}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rubrik } = await params;
  const config = RUBRICS.find((r) => r.slug === rubrik);

  if (!config) {
    return { title: "Halaman Tidak Ditemukan" };
  }

  // Strictly follow instruction: no word 'rubrik' in title
  const cleanTitle = getCategoryCleanTitle(config);
  const fullTitle = `${cleanTitle} - korankuid`;
  const description = `Kumpulan ${cleanTitle.toLowerCase()} terkini, terpercaya, dan terpopuler dari redaksi korankuid seputar ${config.description.toLowerCase()}.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";
  const pageUrl = `${siteUrl}/${config.slug}`;

  return {
    title: cleanTitle,
    description,
    keywords: [
      cleanTitle.toLowerCase(),
      `berita ${config.name.toLowerCase()}`,
      `kabar ${config.name.toLowerCase()}`,
      `${config.name.toLowerCase()} lampung`,
      "korankuid",
      "berita lampung hari ini",
    ],
    alternates: {
      canonical: `/${config.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      type: "website",
      locale: "id_ID",
      siteName: "korankuid",
      images: [
        {
          url: `${siteUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
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

export default async function RubrikPage({ params, searchParams }: PageProps) {
  const { rubrik } = await params;
  const { page: pageStr } = await searchParams;
  const currentPage = parseInt(pageStr || "1", 10) || 1;

  const config = RUBRICS.find((r) => r.slug === rubrik);

  if (!config) {
    notFound();
  }

  const [{ data: articles }, popular, latest] = await Promise.all([
    getCategoryNews(config.categorySlug, currentPage, 12),
    getPopularNews(5),
    getRecentNews(5),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";
  const cleanTitle = getCategoryCleanTitle(config);

  const leadStory = articles.length > 0 ? articles[0] : null;
  const secondaryStories = articles.length > 1 ? articles.slice(1) : [];

  const breadcrumbs = [
    { name: "Beranda", url: `${siteUrl}` },
    { name: cleanTitle, url: `${siteUrl}/${config.slug}` },
  ];

  const itemList = articles.map((art, idx) => ({
    name: art.judul_artikel,
    url: `${siteUrl}/read/${art.idart}/${art.public_slug || art.slug || "berita"}`,
    image: art.img_full_url || art.img_thumb_url,
    position: idx + 1,
  }));

  return (
    <div className="py-2">
      {/* Structured Data (JSON-LD) */}
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ItemListJsonLd
        name={cleanTitle}
        description={config.description}
        itemList={itemList}
      />

      {/* 1. BREADCRUMBS */}
      <nav aria-label="Navigasi remah roti" className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800 uppercase">{config.name}</span>
      </nav>

      {/* 2. CATEGORY SECTION HEADER */}
      <SectionHeader
        title={config.name}
        kicker="Kategori Berita"
        subtitle={config.description}
        accentColor="#052962"
        className="mb-8"
        rightElement={
          <span className="text-xs text-gray-400 font-medium">
            Halaman {currentPage}
          </span>
        }
      />

      {/* 3. ARTICLES CONTENT GRID */}
      {articles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#dcdcdc] rounded-xs shadow-2xs">
          <p className="font-serif text-xl text-gray-700 font-bold mb-2">
            Belum Ada Artikel di Kategori Ini
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
            Tim redaksi kami sedang menyiapkan liputan investigasi dan kabar terkini seputar {config.name}.
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider bg-[#052962] text-white px-5 py-2.5 rounded hover:bg-[#041f4a] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed: 8 Cols */}
          <main className="lg:col-span-8 space-y-6">
            {/* If Opinion style (Sentilan / Opini) */}
            {config.isOpinionStyle ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {articles.map((art) => (
                  <SentilanCard key={art.idart} article={art} />
                ))}
              </div>
            ) : (
              <>
                {/* Regular News: Lead Story Top */}
                {leadStory && (
                  <div className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden shadow-2xs">
                    <LeadStoryCard article={leadStory} />
                  </div>
                )}

                {/* Secondary Stories Grid: 2 Columns */}
                {secondaryStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {secondaryStories.map((story) => (
                      <div
                        key={story.idart}
                        className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden shadow-2xs"
                      >
                        <EditorialGridCard
                          article={story}
                          aspectRatio="landscape"
                          variant="secondary"
                          showStandfirst={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination Controls */}
            <div className="pt-6 mt-8 border-t border-gray-200 flex items-center justify-between">
              {currentPage > 1 ? (
                <Link
                  href={`/${config.slug}?page=${currentPage - 1}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 border border-gray-300 text-xs font-bold uppercase tracking-wider rounded text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </Link>
              ) : (
                <div></div>
              )}

              <span className="text-xs font-semibold text-gray-600">
                Halaman {currentPage}
              </span>

              {articles.length >= 12 ? (
                <Link
                  href={`/${config.slug}?page=${currentPage + 1}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 border border-[#052962] bg-[#052962] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#041f4a]"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </main>

          {/* Sidebar: 4 Cols */}
          <aside className="lg:col-span-4 space-y-6">
            <PopularSidebar articles={popular} />
            <LatestSidebar articles={latest} />

            {/* Category Navigator Widget */}
            <div className="bg-white border border-[#dcdcdc] p-5 rounded-xs shadow-2xs">
              <h3 className="font-serif text-base font-bold uppercase tracking-tight text-gray-950 pb-2 border-b border-gray-200 mb-3">
                Jelajahi Kategori Lainnya
              </h3>
              <div className="space-y-1 text-xs">
                {RUBRICS.filter((r) => r.slug !== config.slug).map((r) => (
                  <Link
                    key={r.id}
                    href={`/${r.slug}`}
                    className="flex items-center justify-between py-2 px-2.5 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962] transition-colors"
                  >
                    <span className="font-medium">{r.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
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
