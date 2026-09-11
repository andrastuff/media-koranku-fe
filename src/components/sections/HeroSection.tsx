import React from "react";
import { AdItem, Article } from "@/lib/types";
import EditorialGridCard from "@/components/cards/EditorialGridCard";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import SidebarAd from "@/components/ads/SidebarAd";

interface HeroSectionProps {
  headlines: Article[];
  hotnews: Article[];
  popular: Article[];
  sidebarAd?: AdItem;
}

export default function HeroSection({
  headlines,
  hotnews,
  popular,
  sidebarAd,
}: HeroSectionProps) {
  if (!headlines || headlines.length === 0) return null;

  const leadStory = headlines[0];
  const secondaryStory1 = headlines[1] || hotnews[0];
  const secondaryStory2 = headlines[2] || hotnews[1];

  const leadSlug = leadStory.public_slug || leadStory.slug || "berita";
  const leadHref = `/read/${leadStory.idart}/${leadSlug}`;
  const leadImgUrl = leadStory.img_full_url || leadStory.img_thumb_url;

  return (
    <section className="mb-5 bg-white border border-[#dcdcdc] rounded-xs p-3.5 sm:p-4 shadow-2xs">
      {/* Editorial Rule Top Border */}
      <SectionHeader
        title="Sorotan Utama Hari Ini"
        kicker="Laporan Utama & Headline"
        accentColor="#052962"
        className="mb-3 pt-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Kolom Utama (8 Kolom): Terbaru 1 Grid di atas, setelahnya 2 Grid di bawah */}
        <div className="lg:col-span-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#dcdcdc] pb-4 lg:pb-0 lg:pr-5">
          {/* 1. TERBARU (1 GRID) */}
          <article className="group flex flex-col">
            {/* Category Kicker Badge */}
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-block text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#cc0000]">
                {leadStory.kategori || "Sorotan Utama"}
              </span>
              {leadStory.kabupaten && (
                <span className="text-xs text-gray-500 font-medium">
                  • {leadStory.kabupaten}
                </span>
              )}
            </div>

            {/* Headline */}
            <ArticleHeadline
              title={leadStory.judul_artikel}
              href={leadHref}
              variant="hero"
              className="mb-2.5 text-xl sm:text-2xl lg:text-[25px] font-serif font-black leading-tight text-gray-950 group-hover:text-[#052962]"
            />

            {/* 1 Grid Content: Landscape image on left + Excerpt & Meta on right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
              <div className="sm:col-span-7">
                <ArticleThumbnail
                  src={leadImgUrl}
                  alt={leadStory.judul_artikel}
                  aspectRatio="landscape"
                  href={leadHref}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="sm:col-span-5 flex flex-col justify-between h-full">
                <ArticleStandfirst
                  content={leadStory.isi_artikel}
                  lines={10}
                  maxChars={380}
                  className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal"
                />

                <ArticleMeta
                  author={leadStory.wartawan}
                  date={leadStory.tanggal}
                  views={leadStory.view}
                  useRelativeTime={true}
                  className="pt-2 mt-2"
                />
              </div>
            </div>
          </article>

          {/* Thin Hairline Editorial Divider */}
          <div className="border-b border-[#dcdcdc] my-3.5" />

          {/* 2. SETELAHNYA KEBAWAH (2 GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            {secondaryStory1 && (
              <div className="flex-1 pr-0 sm:pr-2 border-b sm:border-b-0 sm:border-r border-gray-100 pb-3 sm:pb-0">
                <EditorialGridCard
                  article={secondaryStory1}
                  aspectRatio="landscape"
                  variant="secondary"
                  showStandfirst={true}
                  className="p-0 hover:bg-transparent"
                />
              </div>
            )}

            {secondaryStory2 && (
              <div className="flex-1 pl-0 sm:pl-2">
                <EditorialGridCard
                  article={secondaryStory2}
                  aspectRatio="landscape"
                  variant="secondary"
                  showStandfirst={true}
                  className="p-0 hover:bg-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Kolom Terpopuler (4 Kolom): Tetap 5 Berita + Tombol Lihat Selengkapnya */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <PopularSidebar articles={popular} />
          <SidebarAd ad={sidebarAd} />
        </div>
      </div>
    </section>
  );
}
