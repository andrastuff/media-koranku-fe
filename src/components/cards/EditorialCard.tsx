import React from "react";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import ArticleImageFrame from "@/components/ui/ArticleImageFrame";
import { Article } from "@/lib/types";
import { formatDateIndo, truncateText } from "@/lib/utils";
import { Clock } from "lucide-react";

interface EditorialCardProps {
  article: Article;
  aspectRatio?: "square" | "video" | "wide";
  showExcerpt?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
}

export default function EditorialCard({
  article,
  aspectRatio = "video",
  showExcerpt = true,
  borderRight = true,
  borderBottom = true,
}: EditorialCardProps) {
  const slug = article.public_slug || article.slug || "berita";
  const href = `/read/${article.idart}/${slug}`;
  const imgUrl = article.img_full_url || article.img_thumb_url;

  return (
    <article
      className={`group flex flex-col justify-between h-full bg-white p-4 transition-colors hover:bg-[#fafafa] ${
        borderRight ? "lg:border-r border-[#dcdcdc]" : ""
      } ${borderBottom ? "border-b border-[#dcdcdc]" : ""}`}
    >
      <div>
        {/* Category Kicker */}
        {article.kategori && (
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#cc0000] hover:underline">
              {article.kategori}
            </span>
            {article.kabupaten && (
              <span className="text-[11px] text-gray-400">
                • {article.kabupaten}
              </span>
            )}
          </div>
        )}

        {/* Thumbnail Image */}
        {imgUrl && (
          <ArticleImageFrame
            className={`w-full mb-3 ${
              aspectRatio === "square"
                ? "aspect-square"
                : aspectRatio === "wide"
                ? "aspect-[2/1]"
                : "aspect-video"
            }`}
          >
            <SafeArticleImage
              src={imgUrl}
              alt={article.judul_artikel}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </ArticleImageFrame>
        )}

        {/* Headline */}
        <Link href={href} className="group-hover:text-[#052962] transition-colors">
          <h3 className="font-serif text-lg md:text-xl font-bold leading-snug tracking-tight text-gray-900 group-hover:underline decoration-1 underline-offset-2">
            {article.judul_artikel}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && article.isi_artikel && (
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2 line-clamp-2">
            {truncateText(article.isi_artikel, 100)}
          </p>
        )}
      </div>

      {/* Meta Byline & Date */}
      <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span className="font-medium text-gray-700 truncate max-w-[130px]">
          {article.wartawan || "koranku.id"}
        </span>
        <span className="flex items-center space-x-1 shrink-0">
          <Clock className="w-3 h-3 text-gray-400" />
          <span>{formatDateIndo(article.tanggal)}</span>
        </span>
      </div>
    </article>
  );
}
