import React from "react";
import { Article } from "@/lib/types";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";

interface LeadStoryCardProps {
  article: Article;
  kickerColor?: string;
  className?: string;
  subStories?: Article[];
}

export default function LeadStoryCard({
  article,
  kickerColor = "#cc0000",
  className = "",
  subStories = [],
}: LeadStoryCardProps) {
  const slug = article.public_slug || article.slug || "berita";
  const href = `/read/${article.idart}/${slug}`;
  const imgUrl = article.img_full_url || article.img_thumb_url;

  return (
    <article
      className={`group flex flex-col bg-white p-4 transition-all sm:p-5 ${className}`}
    >
      {/* Category Kicker Badge */}
      <div className="flex items-center space-x-2 mb-2">
        <span
          className="inline-block text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs"
          style={{ backgroundColor: kickerColor }}
        >
          {article.kategori || "Sorotan Utama"}
        </span>
        {article.kabupaten && (
          <span className="text-xs text-gray-500 font-medium">
            • {article.kabupaten}
          </span>
        )}
      </div>

      {/* Lead Headline */}
      <ArticleHeadline
        title={article.judul_artikel}
        href={href}
        variant="hero"
        className="mb-2.5"
      />

      {/* Big Featured Image */}
      <div className="mb-2.5">
        <ArticleThumbnail
          src={imgUrl}
          alt={article.judul_artikel}
          aspectRatio="landscape"
          href={href}
          priority={true}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Standfirst / Excerpt */}
      <ArticleStandfirst
        content={article.isi_artikel}
        lines={3}
        maxChars={180}
        className="text-sm text-gray-700 leading-relaxed font-normal mt-1"
      />

      {/* Meta sits snugly right under the excerpt (NO giant gap!) */}
      <ArticleMeta
        author={article.wartawan}
        date={article.tanggal}
        views={article.view}
        useRelativeTime={true}
        className="pt-2 mt-2"
      />

      {/* Optional Sub-bullet stories to fill the column cleanly if space allows */}
      {subStories.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-gray-200/80 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
            Fokus Terkait:
          </span>
          {subStories.slice(0, 2).map((sub) => {
            const subHref = `/read/${sub.idart}/${sub.public_slug || sub.slug || "berita"}`;
            return (
              <div key={sub.idart} className="flex items-start space-x-2 text-xs group/sub">
                <span className="text-[#cc0000] font-bold shrink-0">•</span>
                <a
                  href={subHref}
                  className="font-serif font-bold text-gray-900 group-hover/sub:text-[#052962] group-hover/sub:underline line-clamp-1 leading-snug"
                >
                  {sub.judul_artikel}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
