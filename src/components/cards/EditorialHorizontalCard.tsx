import React from "react";
import { Article } from "@/lib/types";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";

interface EditorialHorizontalCardProps {
  article: Article;
  kickerColor?: string;
  className?: string;
  showThumbnail?: boolean;
  showStandfirst?: boolean;
}

export default function EditorialHorizontalCard({
  article,
  kickerColor = "#cc0000",
  className = "",
  showThumbnail = true,
  showStandfirst = false,
}: EditorialHorizontalCardProps) {
  const slug = article.public_slug || article.slug || "berita";
  const href = `/read/${article.idart}/${slug}`;
  const imgUrl = article.img_thumb_url || article.img_full_url;

  return (
    <article
      className={`group flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 p-1.5 rounded-xs transition-colors w-full ${className}`}
    >
      <div className="flex-1 min-w-0 flex flex-col">
        <div>
          {article.kategori && (
            <span
              className="text-[9px] font-black uppercase tracking-wider block mb-0.5"
              style={{ color: kickerColor }}
            >
              {article.kategori}
              {article.kabupaten && ` • ${article.kabupaten}`}
            </span>
          )}

          <ArticleHeadline
            title={article.judul_artikel}
            href={href}
            variant="compact"
            lines={2}
          />

          {showStandfirst && article.isi_artikel && (
            <ArticleStandfirst
              content={article.isi_artikel}
              lines={2}
              maxChars={110}
              className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-1"
            />
          )}
        </div>

        <ArticleMeta
          author={article.wartawan}
          date={article.tanggal}
          views={article.view}
          useRelativeTime={true}
          className="border-none pt-1 mt-1 text-[10px]"
        />
      </div>

      {showThumbnail && (
        <div className="w-24 sm:w-28 shrink-0">
          <ArticleThumbnail
            src={imgUrl}
            alt={article.judul_artikel}
            aspectRatio="landscape"
            href={href}
            sizes="120px"
          />
        </div>
      )}
    </article>
  );
}
