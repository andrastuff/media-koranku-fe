import React from "react";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import ArticleImageFrame from "@/components/ui/ArticleImageFrame";
import { Article } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CompactStoryCardProps {
  article: Article;
  rank?: number;
  showThumb?: boolean;
}

export default function CompactStoryCard({
  article,
  rank,
  showThumb = false,
}: CompactStoryCardProps) {
  const slug = article.public_slug || article.slug || "berita";
  const href = `/read/${article.idart}/${slug}`;
  const imgUrl = article.img_thumb_url || article.img_full_url;

  return (
    <article className="group flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 px-2 rounded-xs transition-colors">
      {/* Rank number or Thumb */}
      {rank !== undefined ? (
        <span className="font-serif text-2xl font-black text-[#cc0000] w-6 shrink-0 text-center leading-none mt-0.5">
          {rank}
        </span>
      ) : showThumb && imgUrl ? (
        <ArticleImageFrame className="w-16 h-12 shrink-0">
          <SafeArticleImage
            src={imgUrl}
            alt={article.judul_artikel}
            fill
            sizes="64px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </ArticleImageFrame>
      ) : null}

      <div className="flex-1 min-w-0">
        {article.kategori && (
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
            {article.kategori}
          </span>
        )}

        <Link href={href} className="group-hover:text-[#052962] transition-colors block">
          <h4 className="font-serif text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:underline">
            {article.judul_artikel}
          </h4>
        </Link>

        <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
          <span className="flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{formatDateIndo(article.tanggal)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
