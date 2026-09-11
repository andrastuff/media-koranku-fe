"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { RUBRICS } from "@/lib/types";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer({ logoUrl }: { logoUrl?: string }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#052962] text-white border-t-8 border-brand-secondary mt-6 sm:mt-8">
      {/* 1. TOP FOOTER SECTION */}
      <div className="site-shell py-10 md:py-14 border-b border-blue-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-blue-900/60">
          <div>
            <Link
              href="/"
              aria-label="korankuid - Beranda"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <div className="relative w-52 md:w-60">
                <BrandLogo
                  src={logoUrl}
                  variant="on-dark"
                  width={665}
                  height={180}
                  className="h-auto w-full brightness-0 invert opacity-95"
                />
                {logoUrl && (
                  <BrandLogo
                    src={logoUrl}
                    variant="on-dark"
                    width={665}
                    height={180}
                    decorative
                    className="pointer-events-none absolute inset-0 h-auto w-full [clip-path:inset(0_21.5%_40%_55.3%)]"
                  />
                )}
              </div>
            </Link>
            <p className="text-sm text-gray-300 mt-1 max-w-lg">
              Portal Berita Perkembangan Politik, Ekonomi, Pendidikan, Pemerintahan, Pariwisata, dan Budaya di Provinsi Lampung dan Nasional.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 bg-blue-900/80 hover:bg-brand-secondary hover:text-white transition-colors py-2 px-4 rounded text-xs font-bold uppercase tracking-wider self-end md:self-auto"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* 2. RUBRIK NAVIGATION GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-8 text-xs">
          {RUBRICS.map((rubrik) => (
            <div key={rubrik.id} className="space-y-2">
              <Link
                href={`/${rubrik.slug}`}
                className="font-bold text-sm text-white hover:text-brand-secondary transition-colors uppercase tracking-wider block border-b border-blue-900 pb-1"
              >
                {rubrik.name}
              </Link>
              <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                {rubrik.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. LEGAL & REDAKSI INFO */}
      <div className="site-shell py-8 text-xs text-gray-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          <Link href="/informasi/about" className="hover:text-white transition-colors">
            Tentang Kami
          </Link>
          <span>•</span>
          <Link href="/informasi/redaksi" className="hover:text-white transition-colors">
            Susunan Redaksi
          </Link>
          <span>•</span>
          <Link href="/informasi/pedoman" className="hover:text-white transition-colors">
            Pedoman Media Siber
          </Link>
          <span>•</span>
          <Link href="/informasi/disclaimer" className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <span>•</span>
          <Link href="/kontak" className="hover:text-white transition-colors">
            Iklan & Kontak
          </Link>
        </div>

        <p className="text-center md:text-right">
          Copyright © {new Date().getFullYear()} korankuid. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
