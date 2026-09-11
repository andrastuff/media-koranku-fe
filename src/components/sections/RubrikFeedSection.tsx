import React from "react";
import { Article } from "@/lib/types";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import EditorialHorizontalCard from "@/components/cards/EditorialHorizontalCard";

interface RubrikFeedSectionProps {
  title: string;
  slug: string;
  articles: Article[];
  accentColor?: string;
  description?: string;
  className?: string;
  layout?: "full" | "compact";
}

export default function RubrikFeedSection({
  title,
  slug,
  articles,
  accentColor = "#052962",
  description,
  className = "",
  layout = "full",
}: RubrikFeedSectionProps) {
  if (!articles || articles.length === 0) return null;

  const leadStory = articles[0];
  const sideStories = articles.slice(1, 6); // 5 stories to perfectly balance full layout height

  const leadHref = `/read/${leadStory.idart}/${leadStory.public_slug || leadStory.slug || "berita"}`;
  const leadImg = leadStory.img_full_url || leadStory.img_thumb_url;

  if (layout === "compact") {
    // Compact layout designed for 2-column side-by-side grids (e.g. Politik & Pemerintahan)
    return (
      <section className={`bg-white border border-[#dcdcdc] rounded-xs p-3.5 sm:p-4 shadow-2xs flex flex-col ${className}`}>
        <div>
          <SectionHeader
            title={title}
            href={`/${slug}`}
            subtitle={description}
            accentColor={accentColor}
            className="mb-3 pt-0"
          />

          {/* Lead item on top */}
          <div className="pb-3 mb-1 border-b border-gray-100">
            <div className="mb-2">
              <ArticleThumbnail
                src={leadImg}
                alt={leadStory.judul_artikel}
                aspectRatio="video"
                href={leadHref}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {leadStory.kategori && (
              <span
                className="text-[9px] font-black uppercase tracking-wider block mb-1"
                style={{ color: accentColor }}
              >
                {leadStory.kategori}
                {leadStory.kabupaten && ` • ${leadStory.kabupaten}`}
              </span>
            )}

            <ArticleHeadline
              title={leadStory.judul_artikel}
              href={leadHref}
              variant="primary"
              lines={2}
            />

            <ArticleStandfirst
              content={leadStory.isi_artikel}
              lines={2}
              maxChars={120}
              className="mt-1"
            />

            <ArticleMeta
              author={leadStory.wartawan}
              date={leadStory.tanggal}
              views={leadStory.view}
              useRelativeTime={true}
              className="pt-1.5 mt-1.5"
            />
          </div>

          {/* Secondary stories below (tight & full width) */}
          <div className="divide-y divide-gray-100">
            {sideStories.slice(0, 3).map((story) => (
              <EditorialHorizontalCard
                key={story.idart}
                article={story}
                kickerColor={accentColor}
                showThumbnail={true}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Full-width layout: 7 cols (Left) + 5 cols (Right, 4 stories)
  return (
    <section className={`my-5 bg-white border border-[#dcdcdc] rounded-xs p-3.5 sm:p-4 shadow-2xs ${className}`}>
      <SectionHeader
        title={title}
        href={`/${slug}`}
        subtitle={description}
        accentColor={accentColor}
        className="mb-3 pt-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Major Lead Story: 7 cols */}
        <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#dcdcdc] pb-4 lg:pb-0 lg:pr-4">
          <div>
            <div className="mb-2.5">
              <ArticleThumbnail
                src={leadImg}
                alt={leadStory.judul_artikel}
                aspectRatio="landscape"
                href={leadHref}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            {leadStory.kategori && (
              <span
                className="text-[9px] font-black uppercase tracking-wider block mb-1"
                style={{ color: accentColor }}
              >
                {leadStory.kategori}
                {leadStory.kabupaten && ` • ${leadStory.kabupaten}`}
              </span>
            )}

            <ArticleHeadline
              title={leadStory.judul_artikel}
              href={leadHref}
              variant="lead"
              lines={2}
            />

            <ArticleStandfirst
              content={leadStory.isi_artikel}
              lines={3}
              maxChars={180}
              className="text-sm text-gray-700 mt-1"
            />
          </div>

          <ArticleMeta
            author={leadStory.wartawan}
            date={leadStory.tanggal}
            views={leadStory.view}
            useRelativeTime={true}
            className="pt-2 mt-2"
          />
        </div>

        {/* 5 Secondary Stacked Stories: 5 cols (dense & balanced) */}
        <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-gray-100">
          {sideStories.slice(0, 5).map((story) => (
            <EditorialHorizontalCard
              key={story.idart}
              article={story}
              kickerColor={accentColor}
              showThumbnail={true}
            />
          ))}

          {sideStories.length === 0 && (
            <div className="p-4 text-xs text-gray-400 italic">
              Artikel lainnya sedang disiapkan oleh tim redaksi.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
