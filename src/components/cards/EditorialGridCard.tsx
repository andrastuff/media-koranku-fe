import React from "react";
import { Article } from "@/lib/types";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";

interface EditorialGridCardProps {
  article: Article;
  aspectRatio?: "landscape" | "video" | "square" | "wide";
  showStandfirst?: boolean;
  kickerColor?: string;
  className?: string;
  variant?: "primary" | "secondary" | "compact";
}

export default function EditorialGridCard({
  article,
  aspectRatio = "video",
  showStandfirst = true,
  kickerColor = "#cc0000",
  className = "",
  variant = "primary",
}: EditorialGridCardProps) {
  const slug = article.public_slug || article.slug || "berita";
  const href = `/read/${article.idart}/${slug}`;
  const imgUrl = article.img_full_url || article.img_thumb_url;

  return (
    <article
      className={`group flex flex-col justify-between h-full bg-white p-4 transition-all hover:bg-gray-50/50 ${className}`}
    >
      <div>
        {/* Thumbnail */}
        <div className="mb-3">
          <ArticleThumbnail
            src={imgUrl}
            alt={article.judul_artikel}
            aspectRatio={aspectRatio}
            href={href}
          />
        </div>

        {/* Category Kicker */}
        {article.kategori && (
          <div className="flex items-center space-x-1.5 mb-1.5">
            <span
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider"
              style={{ color: kickerColor }}
            >
              {article.kategori}
            </span>
            {article.kabupaten && (
              <span className="text-[10px] text-gray-400">
                • {article.kabupaten}
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <ArticleHeadline
          title={article.judul_artikel}
          href={href}
          variant={variant}
          lines={2}
        />

        {/* Standfirst / Excerpt */}
        {showStandfirst && (
          <ArticleStandfirst
            content={article.isi_artikel}
            lines={2}
            maxChars={110}
          />
        )}
      </div>

      {/* Footer Meta */}
      <ArticleMeta
        author={article.wartawan}
        date={article.tanggal}
        views={article.view}
        useRelativeTime={true}
      />
    </article>
  );
}
