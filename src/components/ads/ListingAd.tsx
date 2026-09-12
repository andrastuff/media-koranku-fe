"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AdItem } from "@/lib/types";

interface ListingAdProps {
  ad?: AdItem;
}

function safeLink(link?: string) {
  return link && /^(https?:\/\/|\/)/i.test(link) ? link : undefined;
}

export default function ListingAd({ ad }: ListingAdProps) {
  const [failed, setFailed] = useState(false);
  const isCustomImage = Boolean(ad?.img_url) && !failed;
  const href = safeLink(ad?.link) || "/kontak";
  const isExternal = href.startsWith("http");
  const alt = ad?.keterangan?.trim() || "Space iklan halaman daftar korankuid";

  if (isCustomImage && ad?.img_url) {
    const customContent = (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs transition-transform hover:opacity-95">
        <Image
          src={ad.img_url}
          alt={alt}
          width={1280}
          height={200}
          unoptimized
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="w-full h-auto max-h-48 sm:max-h-56 object-contain rounded-lg mx-auto block"
          onError={() => setFailed(true)}
        />
      </div>
    );

    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="block my-6">
        {customContent}
      </a>
    ) : (
      <Link href={href} className="block my-6">
        {customContent}
      </Link>
    );
  }

  // Responsive fallback banner for listing page
  const placeholderCard = (
    <div className="w-full my-6 rounded-xl border border-[#cbd5e1] bg-gradient-to-r from-[#f8fafc] to-[#edf2f7] p-3 sm:p-4 text-gray-900 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-lg border border-dashed border-[#94a3b8]/50 px-3 py-3 sm:px-5 sm:py-3.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Navy accent icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg bg-gradient-to-br from-[#052962] to-[#0b3d7e] flex flex-col justify-center items-center shadow-xs">
            <div className="w-5 sm:w-6 h-1 sm:h-1.5 bg-white rounded-full mb-1" />
            <div className="w-3.5 sm:w-4 h-1 sm:h-1.5 bg-white rounded-full mr-1.5 sm:mr-2" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold tracking-wider uppercase font-serif text-[#052962]">
              SPACE IKLAN
            </h4>
            <p className="text-[11px] sm:text-xs text-[#64748b]">
              Banner halaman daftar • 1280 × 160
            </p>
          </div>
        </div>

        <span className="w-full sm:w-auto text-center px-4 py-2 rounded-full bg-[#c91825] hover:bg-[#b01420] text-white text-xs font-bold tracking-wide transition-all shadow-xs">
          Beriklan di korankuid
        </span>
      </div>
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="block hover:opacity-95">
      {placeholderCard}
    </a>
  ) : (
    <Link href={href} className="block hover:opacity-95">
      {placeholderCard}
    </Link>
  );
}

