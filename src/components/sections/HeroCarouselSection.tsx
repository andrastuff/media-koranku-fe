"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react";
import type { AdItem, Article } from "@/lib/types";
import { formatDateIndo } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import SidebarAd from "@/components/ads/SidebarAd";

interface HeroCarouselSectionProps {
  headlines: Article[];
  featuredNews: Article[];
  popular: Article[];
  sidebarAd?: AdItem;
}

function articleHref(article: Article) {
  return `/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
}

function FeaturedNewsCard({ article }: { article: Article }) {
  const href = articleHref(article);
  const image = article.img_thumb_url || article.img_full_url;

  return (
    <article className="group flex min-w-0 gap-3 border-t border-slate-200 py-3 sm:gap-4 sm:py-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-secondary">
          {article.kategori || "Berita Utama"}
          {article.kabupaten ? ` • ${article.kabupaten}` : ""}
        </span>
        <Link href={href} className="block">
          <h3 className="line-clamp-3 font-serif text-base font-bold leading-snug text-slate-950 transition-colors group-hover:text-[#052962] sm:text-lg">
            {article.judul_artikel}
          </h3>
        </Link>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[10px] text-slate-400 sm:text-[11px]">
          <span className="font-semibold text-slate-700">{article.wartawan || "Redaksi koranku.id"}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDateIndo(article.tanggal)}</span>
          {article.view !== undefined && <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{article.view}</span>}
        </div>
      </div>
      <div className="w-28 shrink-0 sm:w-36 lg:w-40">
        <ArticleThumbnail src={image} alt={article.judul_artikel} aspectRatio="landscape" href={href} sizes="160px" />
      </div>
    </article>
  );
}

export default function HeroCarouselSection({
  headlines,
  featuredNews,
  popular,
  sidebarAd,
}: HeroCarouselSectionProps) {
  const slides = headlines.slice(0, 5);
  const primaryNews = featuredNews.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[activeIndex];
  const href = articleHref(active);
  const image = active.img_full_url || active.img_thumb_url;
  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY !== null ? Math.abs(touchStartY - touchEndY) : 0;

    // Minimum swipe threshold 35px, and ensure horizontal intent
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        move(1); // Swiped left -> next slide
      } else {
        move(-1); // Swiped right -> prev slide
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <section className="mb-5 rounded-sm border border-[#dcdcdc] bg-white p-3.5 shadow-2xs sm:p-4">
      <SectionHeader
        title="Sorotan Utama Hari Ini"
        kicker="Laporan Utama & Headline"
        accentColor="#052962"
        className="mb-3 pt-0"
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8 lg:border-r lg:border-[#dcdcdc] lg:pr-5">
          <div
            className="relative touch-pan-y select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <article key={active.idart} className="hero-slide-enter group">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-sm bg-brand-secondary px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {active.kategori || "Headline"}
                </span>
                {active.kabupaten && <span className="text-xs font-medium text-slate-500">• {active.kabupaten}</span>}
              </div>

              <Link href={href} title={active.judul_artikel} className="block">
                <h2 className="mb-3 font-serif text-2xl font-black leading-[1.12] tracking-tight text-slate-950 transition-colors group-hover:text-[#052962] sm:text-3xl lg:text-[2.15rem] truncate">
                  {active.judul_artikel}
                </h2>
              </Link>

              <div className="grid grid-cols-1 items-start gap-3.5 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <ArticleThumbnail src={image} alt={active.judul_artikel} aspectRatio="landscape" href={href} priority sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
                <div className="flex h-full flex-col justify-between sm:col-span-5">
                  <ArticleStandfirst content={active.isi_artikel} lines={4} maxChars={300} className="mt-0 text-sm text-slate-700" />
                  <ArticleMeta author={active.wartawan} date={active.tanggal} views={active.view} useRelativeTime className="mt-2 pt-2" />
                </div>
              </div>
            </article>

            {slides.length > 1 && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5" aria-label={`Slide ${activeIndex + 1} dari ${slides.length}`}>
                  {slides.map((slide, index) => (
                    <button
                      key={slide.idart}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Tampilkan headline ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-brand-secondary" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => move(-1)} aria-label="Headline sebelumnya" className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-secondary hover:text-brand-secondary"><ChevronLeft className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(1)} aria-label="Headline berikutnya" className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-secondary hover:text-brand-secondary"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>

          {primaryNews.length > 0 && (
            <div className="mt-5 border-t-2 border-[#052962] pt-3">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#052962]">Berita Utama</h2>
                <span className="text-[10px] text-slate-400">Pilihan redaksi</span>
              </div>
              <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
                {primaryNews.map((article) => <FeaturedNewsCard key={article.idart} article={article} />)}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <PopularSidebar articles={popular} />
          <SidebarAd ad={sidebarAd} />
        </aside>
      </div>
    </section>
  );
}
