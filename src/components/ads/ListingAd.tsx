"use client";

import { useState } from "react";
import Image from "next/image";
import type { AdItem } from "@/lib/types";

interface ListingAdProps { ad?: AdItem; }

function safeLink(link?: string) {
  return link && /^(https?:\/\/|\/)/i.test(link) ? link : undefined;
}

export default function ListingAd({ ad }: ListingAdProps) {
  const [failed, setFailed] = useState(false);
  const useFallback = !ad?.img_url || failed;
  const src = useFallback ? "/ads/listing-ad-placeholder.svg" : ad.img_url!;
  const href = useFallback ? undefined : safeLink(ad?.link);
  const alt = ad?.keterangan?.trim() || "Space iklan halaman daftar korankuid";
  const image = (
    <div className="relative aspect-[8/1] min-h-24 w-full overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-xs">
      <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
  if (!href) return image;
  return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer sponsored" : undefined} className="block hover:opacity-95">{image}</a>;
}
