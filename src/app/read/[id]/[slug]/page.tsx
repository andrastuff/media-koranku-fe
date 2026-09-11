import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import { getAds, getNewsDetail, getRelatedNews, getPopularNews, getRecentNews, getComments } from "@/lib/api";
import { formatDateIndo } from "@/lib/utils";
import ShareBar from "@/components/article/ShareBar";
import CommentBox from "@/components/article/CommentBox";
import ViewCounter from "@/components/article/ViewCounter";
import EditorialCard from "@/components/cards/EditorialCard";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import LatestSidebar from "@/components/sidebar/LatestSidebar";
import SidebarAd from "@/components/ads/SidebarAd";
import ArticleInlineAd from "@/components/ads/ArticleInlineAd";
import ArticleImageFrame from "@/components/ui/ArticleImageFrame";
import ArticlePagination from "@/components/article/ArticlePagination";
import { Clock, Eye, User, Tag, ChevronRight, FileText } from "lucide-react";

import { NewsArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const article = await getNewsDetail(id);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const title = article.judul_artikel;
  const fullTitle = `${article.judul_artikel} - korankuid`;
  const cleanExcerpt = article.isi_artikel
    ? article.isi_artikel.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    : "Portal Berita Terkini Perkembangan Politik, Hukum, dan Pembangunan di Provinsi Lampung.";

  const imgUrl = article.img_full_url || article.img_thumb_url;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";
  const articleCanonical = `/read/${article.idart}/${article.public_slug || article.slug || slug || "berita"}`;
  const fullArticleUrl = `${siteUrl}${articleCanonical}`;

  const tagsList = article.tag
    ? article.tag.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    title,
    description: cleanExcerpt,
    keywords: [
      ...tagsList,
      article.kategori,
      article.kabupaten,
      "korankuid",
      "berita lampung",
    ].filter(Boolean) as string[],
    alternates: {
      canonical: articleCanonical,
    },
    openGraph: {
      title: fullTitle,
      description: cleanExcerpt,
      url: fullArticleUrl,
      type: "article",
      publishedTime: article.tanggal,
      modifiedTime: article.tanggal,
      authors: [article.wartawan || "Redaksi korankuid"],
      section: article.kategori || "Berita",
      tags: tagsList,
      images: imgUrl
        ? [
            {
              url: imgUrl,
              width: 1200,
              height: 630,
              alt: article.judul_artikel,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: cleanExcerpt,
      site: "@korankuid",
      creator: "@korankuid",
      images: imgUrl ? [imgUrl] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getNewsDetail(id);

  if (!article) {
    notFound();
  }

  const [relatedArticles, popularArticles, latestArticles, comments, inlineAds, sidebarAds] = await Promise.all([
    getRelatedNews(article.idart, 4),
    getPopularNews(5),
    getRecentNews(5),
    getComments(article.idart),
    getAds("article-inline"),
    getAds("article-sidebar"),
  ]);

  const imgUrl = article.img_full_url || article.img_thumb_url;
  const tagsList = article.tag ? article.tag.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";
  const articleCanonical = `${siteUrl}/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
  const cleanExcerpt = article.isi_artikel
    ? article.isi_artikel.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    : article.judul_artikel;

  const breadcrumbs = [
    { name: "Beranda", url: siteUrl },
    ...(article.kategori ? [{ name: article.kategori, url: `${siteUrl}/${article.kategori.toLowerCase().replace(/\s+/g, "-")}` }] : []),
    { name: article.judul_artikel, url: articleCanonical },
  ];

  return (
    <div className="py-2">
      {/* Structured Data (JSON-LD) */}
      <NewsArticleJsonLd
        title={article.judul_artikel}
        description={cleanExcerpt}
        url={articleCanonical}
        imageUrl={imgUrl}
        datePublished={article.tanggal}
        dateModified={article.tanggal}
        authorName={article.wartawan}
        category={article.kategori}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Invisible View Counter Trigger */}
      <ViewCounter idart={article.idart} />

      {/* 1. BREADCRUMBS */}
      <nav aria-label="Navigasi remah roti" className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        {article.kategori && (
          <>
            <span className="font-semibold text-gray-700">{article.kategori}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </>
        )}
        <span className="text-gray-400 truncate max-w-xs">{article.judul_artikel}</span>
      </nav>

      {/* 2. ARTICLE HEADER */}
      <header className="mb-6">
        {/* Category & Region Kicker */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-[#cc0000] text-white text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-xs">
            {article.kategori || "Berita"}
          </span>
          {article.kabupaten && (
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-xs">
              {article.kabupaten}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-gray-950 mb-4">
          {article.judul_artikel}
        </h1>

        {/* Byline and Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-200 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 font-bold text-gray-900">
              <User className="w-3.5 h-3.5 text-[#052962]" />
              <span>Wartawan: {article.wartawan || "Redaksi koranku.id"}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatDateIndo(article.tanggal)}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-gray-500">
            {article.view && (
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>{article.view} kali dibaca</span>
              </span>
            )}
          </div>
        </div>

        {/* Social Share Bar */}
        <ShareBar title={article.judul_artikel} />
      </header>

      {/* 3. MAIN ARTICLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Middle: Content Container (8 Cols) */}
        <main className="lg:col-span-8">
          {/* Main Featured Image */}
          {imgUrl && (
            <figure className="mb-6">
              <ArticleImageFrame className="w-full aspect-video sm:aspect-[16/10]">
                <SafeArticleImage
                  src={imgUrl}
                  alt={article.judul_artikel}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </ArticleImageFrame>
              <figcaption className="text-xs text-gray-500 italic mt-2 text-center sm:text-left">
                Dokumentasi: {article.judul_artikel} (korankuid)
              </figcaption>
            </figure>
          )}

          {/* ARTICLE CONTENT (WYSIWYG Compatibility Container) */}
          <div
              className="article-content prose prose-lg max-w-none text-gray-800 font-sans"
            dangerouslySetInnerHTML={{ __html: article.isi_artikel || "" }}
          />

          {/* MULTI-PAGE ARTICLE PAGINATION (Lanjutan Halaman Berita) */}
          <ArticlePagination pages={article.pages || []} currentIdart={article.idart} />

          {/* TAGS CLOUD */}
          {tagsList.length > 0 && (
            <div className="my-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Tag Terkait:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tagItem, idx) => (
                  <Link
                    key={idx}
                    href={`/tag/${encodeURIComponent(tagItem.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="text-xs font-medium bg-gray-100 hover:bg-[#052962] hover:text-white px-3 py-1 rounded-full text-gray-700 transition-colors"
                  >
                    #{tagItem}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Bar Bottom */}
          <ShareBar title={article.judul_artikel} />

          <div id="article-inline-ad" className="my-8 scroll-mt-28">
            <ArticleInlineAd ad={inlineAds[0]} />
          </div>

          {/* RELATED ARTICLES SECTION */}
          {relatedArticles.length > 0 && (
            <div className="my-10 pt-8 border-t-2 border-[#052962]">
              <h3 className="font-serif text-xl font-bold uppercase tracking-tight text-gray-950 mb-6">
                Berita Terkait
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <EditorialCard
                    key={rel.idart}
                    article={rel}
                    aspectRatio="video"
                    borderRight={false}
                    borderBottom={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* COMMENT SECTION */}
          <CommentBox idart={article.idart} initialComments={comments} />
        </main>

        {/* Right: Sidebar Container (4 Cols) */}
        <aside className="lg:col-span-4 space-y-8">
          <PopularSidebar articles={popularArticles} />
          <SidebarAd ad={sidebarAds[0]} fallbackSrc="/ads/article-sidebar-ad-placeholder.svg" />
          <LatestSidebar articles={latestArticles} />
        </aside>
      </div>
    </div>
  );
}
