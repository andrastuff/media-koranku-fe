"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface SafeArticleImageProps
  extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src?: string | null;
  alt: string;
}

const FALLBACK_IMAGE = "/images/article-image-placeholder.svg";

export default function SafeArticleImage({
  src,
  alt,
  ...props
}: SafeArticleImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const useFallback = !src || failed;

  return (
    <Image
      {...props}
      src={useFallback ? FALLBACK_IMAGE : src}
      alt={useFallback ? "Gambar berita belum tersedia" : alt}
      onError={() => setFailed(true)}
    />
  );
}
