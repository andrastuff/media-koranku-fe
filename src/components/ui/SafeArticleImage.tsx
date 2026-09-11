"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface SafeArticleImageProps
  extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src?: string | null;
  fallbackSrc?: string | null;
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
  fallbackSrc,
  alt,
  unoptimized,
  ...props
}: SafeArticleImageProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);

  useEffect(() => {
    setFailedSources([]);
  }, [src, fallbackSrc]);

  const primaryAvailable = Boolean(src && !failedSources.includes(src));
  const parentAvailable = Boolean(fallbackSrc && !failedSources.includes(fallbackSrc));
  const resolvedSrc = primaryAvailable
    ? src!
    : parentAvailable
      ? fallbackSrc!
      : FALLBACK_IMAGE;
  const usePlaceholder = resolvedSrc === FALLBACK_IMAGE;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={usePlaceholder ? "Gambar berita belum tersedia" : alt}
      unoptimized={unoptimized || isPrivateNetworkImage(resolvedSrc)}
      onError={() => setFailedSources((current) => [...current, resolvedSrc])}
    />
  );
}
