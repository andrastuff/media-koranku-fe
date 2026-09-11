import React from "react";
import Link from "next/link";
import ArticleImageFrame from "@/components/ui/ArticleImageFrame";
import SafeArticleImage from "@/components/ui/SafeArticleImage";

interface ArticleThumbnailProps {
  src?: string;
  alt: string;
  aspectRatio?: "landscape" | "video" | "square" | "portrait" | "wide";
  priority?: boolean;
  className?: string;
  badge?: string;
  badgeColor?: string;
  href?: string;
  sizes?: string;
}

export default function ArticleThumbnail({
  src,
  alt,
  aspectRatio = "video",
  priority = false,
  className = "",
  badge,
  badgeColor = "bg-[#cc0000]",
  href,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ArticleThumbnailProps) {
  const aspectClasses = {
    landscape: "aspect-[16/10]",
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[2/1]",
  };

  const containerContent = (
    <ArticleImageFrame
      className={`w-full group/thumb ${aspectClasses[aspectRatio]} ${className}`}
    >
      <SafeArticleImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover group-hover/thumb:scale-105 transition-transform duration-500 ease-out"
      />

      {badge && (
        <span
          className={`absolute top-2 left-2 ${badgeColor} text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs`}
        >
          {badge}
        </span>
      )}
    </ArticleImageFrame>
  );

  if (href) {
    return (
      <Link href={href} className="block shrink-0">
        {containerContent}
      </Link>
    );
  }

  return containerContent;
}
