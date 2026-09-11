import React from "react";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import { Article } from "@/lib/types";
import { formatDateIndo, truncateText } from "@/lib/utils";
import { Quote } from "lucide-react";

interface SentilanCardProps {
  article: Article;
  authorTitle?: string;
}

export default function SentilanCard({
  article,
  authorTitle = "Kolumnis",
}: SentilanCardProps) {
  const slug = article.public_slug || article.slug || "sentilan";
  const href = `/read/${article.idart}/${slug}`;
  const authorName = article.wartawan || "Redaksi";
  const imgUrl = article.img_full_url || article.img_thumb_url;

  return (
    <article className="group flex flex-col justify-between h-full min-h-[290px] bg-[#fef6eb] border border-[#f2dfce] p-4 rounded-xs hover:border-[#e5cbb5] transition-all shadow-xs hover:shadow-sm">
      <div>
        {/* Header: Quote Icon only (no redundant badge label) */}
        <div className="flex items-center justify-between mb-2">
          <Quote className="w-5 h-5 text-[#c74600]/50 group-hover:text-[#c74600] transition-colors" />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
          <div className="min-w-0">
            {/* Title / Opinion Statement */}
            <Link href={href} className="group-hover:text-[#c74600] transition-colors block">
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug tracking-tight text-gray-950 mb-2 group-hover:underline decoration-2 underline-offset-2 line-clamp-3">
                &ldquo;{article.judul_artikel}&rdquo;
              </h3>
            </Link>

            {/* Excerpt */}
            {article.isi_artikel && (
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-serif italic line-clamp-3 my-2">
                {truncateText(article.isi_artikel, 140)}
              </p>
            )}
          </div>

          <ArticleThumbnail
            src={imgUrl}
            alt={article.judul_artikel}
            aspectRatio="landscape"
            href={href}
            sizes="112px"
            className="bg-white"
          />
        </div>
      </div>

      {/* Author Byline with Circular Avatar (The Guardian Style) */}
      <div className="pt-3.5 mt-3 border-t border-[#f0ded0] flex items-center space-x-3">
        {imgUrl ? (
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-orange-200">
            <SafeArticleImage
              src={imgUrl}
              alt={authorName}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#c74600] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs shrink-0">
            {authorName.charAt(0)}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-black text-gray-950 truncate group-hover:text-[#c74600] transition-colors">
            {authorName}
          </p>
          <p className="text-[11px] text-gray-600 truncate">{authorTitle}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {formatDateIndo(article.tanggal)}
          </p>
        </div>
      </div>
    </article>
  );
}
