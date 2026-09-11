"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface SafeArticleImageProps
  extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src?: string | null;
  alt: string;
}

const FALLBACK_IMAGE = "/images/article-image-placeholder.svg";

function isPrivateNetworkImage(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;

  try {
    const hostname = new URL(src).hostname.replace(/^\[|\]$/g, "").toLowerCase();
    if (hostname === "localhost" || hostname === "::1" || hostname.endsWith(".local")) {
      return true;
    }

    const parts = hostname.split(".").map(Number);
    if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;

    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168)
    );
  } catch {
    return false;
  }
}

export default function SafeArticleImage({
  src,
  alt,
  unoptimized,
  ...props
}: SafeArticleImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const useFallback = !src || failed;
  const resolvedSrc = useFallback ? FALLBACK_IMAGE : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={useFallback ? "Gambar berita belum tersedia" : alt}
      unoptimized={unoptimized || isPrivateNetworkImage(resolvedSrc)}
      onError={() => setFailed(true)}
    />
  );
}
