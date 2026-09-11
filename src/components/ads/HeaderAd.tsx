"use client";

import { useState } from "react";
import Image from "next/image";
import type { AdItem } from "@/lib/types";

interface HeaderAdProps { ad?: AdItem; }

function safeLink(link?: string) {
  return link && /^(https?:\/\/|\/)/i.test(link) ? link : undefined;
}

export default function HeaderAd({ ad }: HeaderAdProps) {
  const [failed, setFailed] = useState(false);
  const useFallback = !ad?.img_url || failed;
  const src = useFallback ? "/ads/header-ad-placeholder.svg" : ad.img_url!;
  const href = useFallback ? undefined : safeLink(ad?.link);
  const alt = ad?.keterangan?.trim() || "Space iklan Header korankuid ukuran 728 kali 90";
  const image = <Image src={src} alt={alt} width={728} height={90} unoptimized className="h-auto w-full" onError={() => setFailed(true)} />;

  if (!href) return image;
  return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer sponsored" : undefined} className="block transition-opacity hover:opacity-95">{image}</a>;
}
