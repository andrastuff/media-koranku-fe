"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdItem } from "@/lib/types";

interface AdBannerProps {
  ad?: AdItem;
  sizeText?: string;
  className?: string;
  ariaLabel?: string;
}

export default function AdBanner({
  ad,
  sizeText = "FORMAT BANNER 970 × 250 PX",
  className = "",
  ariaLabel = "Space Iklan Banner",
}: AdBannerProps) {
  const [imageError, setImageError] = useState(false);

  // Checks if there's an actual custom advertiser image uploaded via backend tbl_ads
  const isCustomImage =
    Boolean(ad?.img_url) &&
    !ad?.img_url?.includes("banner-daerah-default") &&
    !ad?.img_url?.includes("banner-footer-default") &&
    !ad?.img_url?.includes("sidebar-ad-default") &&
    !imageError;

  const targetLink = ad?.link?.trim() || "/kontak";
  const isExternal = targetLink.startsWith("http://") || targetLink.startsWith("https://");

  return (
    <section
      aria-label={ariaLabel}
      className={`my-6 sm:my-7 w-full ${className}`}
    >
      {isCustomImage && ad?.img_url ? (
        // Custom advertiser banner uploaded via backend tbl_ads
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs transition-transform hover:opacity-95">
          <a
            href={targetLink}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer sponsored" : undefined}
            className="block"
          >
            <Image
              src={ad.img_url}
              alt={ad.keterangan || ariaLabel}
              width={1200}
              height={250}
              unoptimized
              onError={() => setImageError(true)}
              className="w-full h-auto max-h-56 sm:max-h-64 object-contain rounded-lg mx-auto block"
            />
          </a>
        </div>
      ) : (
        // Default branded Ad Space Placeholder when there is no custom sponsor image
        <div className="w-full rounded-xl border border-[#cbd5e1] bg-gradient-to-b from-[#f8fafc] to-[#eef3f9] p-2.5 sm:p-3.5 shadow-2xs">
          <div className="w-full rounded-lg border-2 border-dashed border-[#94a3b8]/60 px-4 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            
            {/* Left/Center: Circle Icon & Typography */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
              {/* Vibrant Gradient Circle Icon with White Bars */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ec4899] via-[#fb923c] to-[#f43f5e] flex flex-col justify-center items-center shadow-xs shrink-0">
                <div className="w-6 sm:w-7 h-1.5 sm:h-2 bg-white rounded-full mb-1 sm:mb-1.5" />
                <div className="w-4 sm:w-5 h-1.5 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2" />
              </div>

              <div>
                <h3 className="text-lg sm:text-2xl font-extrabold tracking-widest text-[#052962] uppercase font-serif">
                  SPACE IKLAN
                </h3>
                <p className="text-[11px] sm:text-xs font-bold tracking-wider text-[#64748b] uppercase mt-0.5">
                  {sizeText}
                </p>
              </div>
            </div>

            {/* Right: CTA Pill Button */}
            <div className="w-full sm:w-auto shrink-0 text-center">
              {isExternal ? (
                <a
                  href={targetLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Beriklan di korankuid
                </a>
              ) : (
                <Link
                  href={targetLink}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Beriklan di korankuid
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
