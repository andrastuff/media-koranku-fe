"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import SentilanCard from "@/components/cards/SentilanCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SentilanSectionProps {
  articles: Article[];
  opiniArticles?: Article[];
}

export default function SentilanSection({
  articles,
  opiniArticles = [],
}: SentilanSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Focus specifically on Sentilan, fallback to Opini if empty
  const displayArticles = articles.length > 0 ? articles : opiniArticles;

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", updateScrollState);
      }
      window.removeEventListener("resize", updateScrollState);
    };
  }, [displayArticles]);

  // Auto-play timer (slides smoothly every 4.5 seconds, pauses on hover/touch)
  useEffect(() => {
    if (isPaused || displayArticles.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If at or near end, loop smoothly back to the beginning
      if (container.scrollLeft >= maxScroll - 25) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 330, behavior: "smooth" });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, displayArticles.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = direction === "left" ? -330 : 330;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY !== null ? Math.abs(touchStartY - touchEndY) : 0;

    // Minimum swipe threshold 35px, and ensure horizontal intent
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        handleScroll("right"); // Swiped left -> advance forward
      } else {
        handleScroll("left"); // Swiped right -> go back
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  if (displayArticles.length === 0) return null;

  return (
    <section className="my-6 bg-[#fef6eb] border border-[#f0ded0] rounded-xs p-4 sm:p-5 shadow-2xs">
      {/* Header Section with Slider Controls */}
      <SectionHeader
        title="Sentilan"
        kicker="Catatan Kritis & Pemikiran Kolumnis"
        subtitle="Analisis tajam, kritik konstruktif, dan gagasan berani dari para kolumnis pilihan."
        accentColor="#c74600"
        className="mb-4"
        rightElement={
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sentilan"
              className="text-xs font-bold uppercase tracking-wider text-[#c74600] hover:underline flex items-center gap-1"
            >
              <span>Selengkapnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Navigation Buttons (Visible on mobile & desktop) */}
            <div className="flex items-center gap-1.5 ml-1 pl-2 sm:ml-2 sm:pl-3 border-l border-[#f0ded0]">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Geser ke kiri"
                className="w-7 h-7 rounded-full border border-[#f0ded0] bg-white text-[#c74600] flex items-center justify-center hover:bg-[#c74600] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Geser ke kanan"
                className="w-7 h-7 rounded-full border border-[#f0ded0] bg-white text-[#c74600] flex items-center justify-center hover:bg-[#c74600] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Interactive Horizontal Slider with Touch Swipe & Pause */}
      <div
        className="relative group/slider select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto touch-pan-x overscroll-x-contain snap-x snap-mandatory scrollbar-none pb-2 pt-1 -mx-1 px-1 items-stretch"
        >
          {displayArticles.map((article) => (
            <div
              key={article.idart}
              className="snap-start shrink-0 w-[84vw] sm:w-[320px] md:w-[330px] lg:w-[310px] flex flex-col"
            >
              <SentilanCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
