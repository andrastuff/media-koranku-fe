import React from "react";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import { Article } from "@/lib/types";
import { truncateText, formatDateIndo } from "@/lib/utils";
import { Quote, ArrowRight } from "lucide-react";

interface SentilanSpotlightCardProps {
  article: Article;
  className?: string;
}

export default function SentilanSpotlightCard({
  article,
  className = "",
}: SentilanSpotlightCardProps) {
  const slug = article.public_slug || article.slug || "sentilan";
  const href = `/read/${article.idart}/${slug}`;
  const authorName = article.wartawan || "Kolumnis Sentilan";
  const imgUrl = article.img_full_url || article.img_thumb_url;

  return (
    <article
      className={`group bg-[#fef6eb] border border-[#f2dfce] hover:border-[#c74600] rounded-xs p-3.5 transition-all shadow-xs ${className}`}
    >
      {/* Header bar: Rubrik Badge & Quote Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#c74600] bg-orange-100/90 px-2 py-0.5 rounded-xs">
            Sentilan
          </span>
          <span className="text-[10px] text-gray-400">• Opini Kolom</span>
        </div>
        <Quote className="w-5 h-5 text-[#c74600]/40 group-hover:text-[#c74600] transition-colors shrink-0" />
      </div>

      {/* Main Opinion Headline */}
      <Link href={href} className="block group-hover:text-[#c74600] transition-colors mb-1.5">
        <h4 className="font-serif text-base sm:text-lg font-bold leading-snug text-gray-950 group-hover:underline decoration-1 underline-offset-2">
          &ldquo;{article.judul_artikel}&rdquo;
        </h4>
      </Link>

      {/* Excerpt */}
      {article.isi_artikel && (
        <p className="font-serif italic text-xs text-gray-700 line-clamp-2 leading-relaxed mb-2.5">
          {truncateText(article.isi_artikel, 120)}
        </p>
      )}

      {/* Author Byline with Circular Avatar */}
      <div className="pt-2 border-t border-[#f0ded0] flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          {imgUrl ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ecd3bb] shrink-0 bg-[#fffaf2]">
              <SafeArticleImage
                src={imgUrl}
                alt={authorName}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#c74600] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0">
              {authorName.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-950 truncate group-hover:text-[#c74600] transition-colors">
              {authorName}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {formatDateIndo(article.tanggal)}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="text-[11px] font-bold text-[#c74600] hover:underline flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Baca Kolom</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
