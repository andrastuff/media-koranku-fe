"use client";

import { useState } from "react";
import Image from "next/image";
import { AdItem } from "@/lib/types";

interface SidebarAdProps {
  ad?: AdItem;
  fallbackSrc?: string;
}

function getSafeAdLink(link?: string) {
  if (!link) return undefined;
  return /^(https?:\/\/|\/)/i.test(link) ? link : undefined;
}

export default function SidebarAd({ ad, fallbackSrc = "/ads/sidebar-ad-placeholder.svg" }: SidebarAdProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const useFallback = !ad?.img_url || failedImageUrl === ad.img_url;
  const imageSrc = useFallback
    ? fallbackSrc
    : (ad?.img_url ?? fallbackSrc);
  const safeLink = useFallback ? undefined : getSafeAdLink(ad?.link);
  const alt = ad?.keterangan?.trim() || "Space iklan korankuid";

  const content = (
    <div className="relative mx-auto aspect-square w-full max-w-80 overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-xs">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        unoptimized
        onError={() => {
          if (!useFallback && ad?.img_url) setFailedImageUrl(ad.img_url);
        }}
        sizes="(max-width: 1024px) 80vw, 320px"
        className="object-cover"
      />
    </div>
  );

  if (!safeLink) return content;

  return (
    <a
      href={safeLink}
      target={safeLink.startsWith("http") ? "_blank" : undefined}
      rel={safeLink.startsWith("http") ? "noopener noreferrer sponsored" : undefined}
      aria-label={alt}
      className="block transition-opacity hover:opacity-95"
    >
      {content}
    </a>
  );
}
