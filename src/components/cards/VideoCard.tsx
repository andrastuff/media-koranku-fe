import React from "react";
import Link from "next/link";
import SafeArticleImage from "@/components/ui/SafeArticleImage";
import { Play } from "lucide-react";
import { Article, AdItem } from "@/lib/types";
import ArticleImageFrame from "@/components/ui/ArticleImageFrame";

interface VideoCardProps {
  item: Article | AdItem;
  isAd?: boolean;
}

export default function VideoCard({ item, isAd = false }: VideoCardProps) {
  let title = "";
  let link = "#";
  let thumbUrl = "";

  if (isAd) {
    const ad = item as AdItem;
    title = ad.keterangan || "korankuid TV Channel";
    link = ad.link || "https://www.youtube.com/@korankuid";
    thumbUrl = ad.img_url || "";
  } else {
    const article = item as Article;
    title = article.judul_artikel;
    const slug = article.public_slug || article.slug || "video";
    link = `/read/${article.idart}/${slug}`;
    thumbUrl = article.img_full_url || article.img_thumb_url || "";
  }

  return (
    <ArticleImageFrame className="group flex flex-col bg-gray-900 text-white shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail with Play Icon */}
      <div className="relative w-full aspect-video bg-gray-950 overflow-hidden">
        {thumbUrl ? (
          <SafeArticleImage
            src={thumbUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
            <span>Video korankuid TV</span>
          </div>
        )}

        {/* Video Duration / Live Badge */}
        <div className="absolute top-2 left-2 bg-[#cc0000] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-xs tracking-wider">
          KORANKUID TV
        </div>

        {/* Big Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#cc0000] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="p-3 bg-gray-950 flex-1 flex flex-col justify-between">
        {isAd ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-sm font-bold text-gray-100 hover:text-brand-secondary line-clamp-2 transition-colors"
          >
            {title}
          </a>
        ) : (
          <Link
            href={link}
            className="font-serif text-sm font-bold text-gray-100 hover:text-brand-secondary line-clamp-2 transition-colors"
          >
            {title}
          </Link>
        )}
      </div>
    </ArticleImageFrame>
  );
}
