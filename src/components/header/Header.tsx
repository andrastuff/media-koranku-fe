"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, TrendingUp, X } from "lucide-react";
import { AdItem, Article, RUBRICS, TagItem } from "@/lib/types";
import BrandLogo from "@/components/ui/BrandLogo";
import HeaderAd from "@/components/ads/HeaderAd";

interface HeaderProps {
  logoUrl?: string;
  headerAd?: AdItem;
  focusTags?: TagItem[];
  marqueeHeadlines?: Article[];
}

export default function Header({
  logoUrl,
  headerAd,
  focusTags = [],
  marqueeHeadlines = [],
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const topFocusTags = [...focusTags]
    .filter((tag) => tag.nama_tag && Number(tag.count || 0) > 0)
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 5);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="w-full bg-[#052962] text-white shadow-md">
      {/* 1. TOP UTILITY BAR */}
      <div className="border-b border-[#21477c] bg-[#031f4a]">
        <div className="site-shell flex items-center gap-4 py-2 text-xs tracking-wide">
          <span className="hidden shrink-0 font-medium text-blue-100 sm:inline">{today}</span>

          {marqueeHeadlines.length > 0 && (
            <div className="headline-marquee min-w-0 flex-1" aria-label="Headline lainnya">
              <div className="headline-marquee-track">
                {[0, 1].map((copyIndex) => (
                  <div
                    key={copyIndex}
                    className="headline-marquee-group"
                    aria-hidden={copyIndex === 1}
                  >
                    {marqueeHeadlines.map((article) => (
                      <Link
                        key={`${copyIndex}-${article.idart}`}
                        href={`/read/${article.idart}/${article.public_slug || article.slug || "berita"}`}
                        className="headline-marquee-link"
                        tabIndex={copyIndex === 1 ? -1 : undefined}
                      >
                        <span className="headline-marquee-dot" aria-hidden="true" />
                        {article.judul_artikel}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto flex shrink-0 items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 text-emerald-400 font-medium bg-blue-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>E-Paper & Portal Resmi</span>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center space-x-1 rounded py-1 pl-2 transition-colors hover:bg-blue-900/50 hover:text-brand-secondary"
              aria-label="Cari Berita"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cari</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded py-1 pl-1 hover:bg-blue-900/50 lg:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR ACCORDION */}
      {searchOpen && (
        <div className="bg-blue-950 border-b border-blue-800 py-3 px-4 transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Ketik kata kunci berita lalu tekan Enter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white text-gray-900 px-4 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              autoFocus
            />
            <button
              type="submit"
              className="bg-brand-secondary px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-secondary-hover"
            >
              Cari
            </button>
          </form>
        </div>
      )}

      {/* 2. BRAND & AD MASTHEAD */}
      <div className="bg-[#f3f7fb] bg-[url('/brand/masthead-editorial-pattern.svg')] bg-cover bg-center">
      <div className="site-shell grid grid-cols-[minmax(72px,96px)_minmax(0,1fr)] items-center gap-3 py-2 sm:grid-cols-[minmax(110px,150px)_minmax(0,1fr)] sm:gap-5 md:py-3 lg:grid-cols-[minmax(280px,1fr)_minmax(480px,728px)] lg:gap-8">
        <div className="flex min-w-0 justify-start">
          <Link
            href="/"
            aria-label="korankuid - Beranda"
            className="inline-flex max-w-full transition-opacity hover:opacity-90"
          >
            <BrandLogo
              src={logoUrl}
              priority
              className={logoUrl ? "h-16 max-w-full w-auto sm:h-24 md:h-28 lg:h-32" : "h-auto max-w-full w-24 sm:w-36 lg:w-88"}
            />
          </Link>
        </div>

        <div className="min-w-0 w-full justify-self-end overflow-hidden rounded-sm">
          <HeaderAd ad={headerAd} />
        </div>
      </div>
      </div>
    </header>

    {/* Sticky navigation: remains visible after the masthead scrolls away. */}
    <div id="sticky-site-navigation" className="sticky top-0 z-50 w-full border-b-2 border-brand-secondary bg-[#041f4a]/[0.98] text-white shadow-[0_6px_20px_rgba(3,24,56,0.16)] backdrop-blur-md">
      {/* 3. PRIMARY NAVIGATION */}
      <nav aria-label="Kategori berita" className="border-t border-white/10">
        <div className="overflow-x-auto overscroll-x-contain scrollbar-none">
          <div className="site-shell">
            <div className="flex w-max min-w-full items-center gap-1 py-1.5">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`relative flex h-9 items-center whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition-colors ${
              pathname === "/"
                ? "bg-white/10 text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-secondary"
                : "text-blue-100/85 hover:bg-white/[0.07] hover:text-white"
            }`}
          >
            Beranda
          </Link>

          {RUBRICS.map((rubrik) => {
            const isActive = pathname === `/${rubrik.slug}`;
            return (
              <Link
                key={rubrik.id}
                href={`/${rubrik.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-9 items-center whitespace-nowrap rounded-md px-3 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "bg-white/10 text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-secondary"
                    : "text-blue-100/85 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {rubrik.name}
              </Link>
            );
          })}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. COMPACT FOCUS TICKER */}
      {topFocusTags.length > 0 && <div className="border-t border-white/[0.08] bg-[#031838]">
        <div className="overflow-x-auto overscroll-x-contain scrollbar-none">
          <div className="site-shell">
            <div className="flex w-max min-w-full items-center gap-2 whitespace-nowrap py-1.5">
              <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-secondary">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Fokus
              </span>
              {topFocusTags.map((tag) => {
                const tagSlug = tag.tag_seo || tag.nama_tag.toLowerCase().trim().replace(/\s+/g, "-");
                return (
                <Link
                  key={tag.id_tag || tagSlug}
                  href={`/tag/${encodeURIComponent(tagSlug)}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-blue-100/80 transition-colors hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
                >
                  {tag.nama_tag}
                </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>}

      {/* 5. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#041f4a] border-t border-blue-800 p-4 space-y-2">
          <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider mb-2">
            Kategori Berita
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 bg-blue-950 rounded text-sm hover:bg-blue-900"
            >
              Beranda
            </Link>
            {RUBRICS.map((rubrik) => (
              <Link
                key={rubrik.id}
                href={`/${rubrik.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 bg-blue-950 rounded text-sm hover:bg-blue-900"
              >
                {rubrik.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-blue-900 mt-4 text-xs text-gray-300 space-y-1">
            <Link href="/informasi/redaksi" className="block hover:text-white">
              Halaman Redaksi
            </Link>
            <Link href="/informasi/pedoman" className="block hover:text-white">
              Pedoman Media Siber
            </Link>
            <Link href="/kontak" className="block hover:text-white">
              Kontak Kami
            </Link>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
