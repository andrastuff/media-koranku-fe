"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Article, Region } from "@/lib/types";
import { fetchClientRegionNews } from "@/lib/client-api";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleHeadline from "@/components/ui/ArticleHeadline";
import ArticleStandfirst from "@/components/ui/ArticleStandfirst";
import ArticleMeta from "@/components/ui/ArticleMeta";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import EditorialHorizontalCard from "@/components/cards/EditorialHorizontalCard";
import { MapPin, ArrowRight } from "lucide-react";

interface DaerahSectionProps {
  initialArticles: Article[];
  regions?: Region[];
}

export default function DaerahSection({
  initialArticles,
  regions = [],
}: DaerahSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [regionCache, setRegionCache] = useState<Record<string, Article[]>>({});
  const [loadingRegion, setLoadingRegion] = useState<boolean>(false);

  const defaultDistricts = [
    "Bandar Lampung",
    "Lampung Selatan",
    "Lampung Tengah",
    "Lampung Utara",
    "Lampung Timur",
    "Lampung Barat",
    "Tanggamus",
    "Pringsewu",
    "Pesawaran",
    "Metro",
    "Tulang Bawang",
    "Tulang Bawang Barat",
    "Mesuji",
    "Pesisir Barat",
    "Way Kanan",
  ];

  const handleSelectRegion = async (regName: string, idkabOrSlug?: string | number) => {
    setSelectedRegion(regName);
    if (regName === "all") return;

    // Check if we already have articles cached for this region
    if (regionCache[regName] && regionCache[regName].length > 0) return;

    const targetIdentifier = idkabOrSlug || regName;
    setLoadingRegion(true);

    try {
      const news = await fetchClientRegionNews(targetIdentifier, 4);
      setRegionCache((prev) => ({
        ...prev,
        [regName]: news,
      }));
    } catch {
      // Keep existing fallback
    } finally {
      setLoadingRegion(false);
    }
  };

  // Determine which articles to display
  let currentArticles: Article[] = [];
  if (selectedRegion === "all") {
    currentArticles = initialArticles;
  } else if (regionCache[selectedRegion]) {
    currentArticles = regionCache[selectedRegion];
  } else {
    // Fallback while loading or if not cached yet
    currentArticles = initialArticles.filter((art) => {
      if (!art.kabupaten) return false;
      return art.kabupaten.toLowerCase().includes(selectedRegion.toLowerCase());
    });
  }

  const leadStory = currentArticles[0];
  const sideStories = currentArticles.slice(1, 4);

  const activeRegionObj = regions.find(
    (r) =>
      r.kabupaten.toLowerCase() === selectedRegion.toLowerCase() ||
      r.slug === selectedRegion.toLowerCase()
  );

  const headerHref =
    selectedRegion !== "all" && activeRegionObj?.idkab
      ? `/daerah/${activeRegionObj.idkab}`
      : "/daerah";

  return (
    <section className="my-6 bg-white border border-[#dcdcdc] rounded-xs p-4 sm:p-5 shadow-2xs">
      {/* Section Header */}
      <SectionHeader
        title="Kabar Daerah Lampung"
        href={headerHref}
        kicker="Dinamika Kabupaten / Kota"
        subtitle="Liputan perkembangan infrastruktur, ekonomi daerah, pelayanan warga, dan potensi lokal se-Provinsi Lampung."
        accentColor="#052962"
        className="mb-4 pt-1"
      />

      {/* District Pill Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs border-b border-gray-100">
        <button
          onClick={() => handleSelectRegion("all")}
          className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all whitespace-nowrap text-[11px] ${
            selectedRegion === "all"
              ? "bg-[#052962] text-white shadow-2xs"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Semua Wilayah
        </button>

        {regions.length > 0
          ? regions.map((reg) => (
              <button
                key={reg.idkab}
                onClick={() => handleSelectRegion(reg.kabupaten, reg.idkab)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap text-[11px] ${
                  selectedRegion === reg.kabupaten
                    ? "bg-[#052962] text-white font-bold shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {reg.kabupaten}
              </button>
            ))
          : defaultDistricts.map((name) => (
              <button
                key={name}
                onClick={() => handleSelectRegion(name, name)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap text-[11px] ${
                  selectedRegion === name
                    ? "bg-[#052962] text-white font-bold shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {name}
              </button>
            ))}
      </div>

      {/* Loading Skeleton */}
      {loadingRegion ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-pulse">
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#dcdcdc] pb-6 lg:pb-0 lg:pr-6 space-y-3.5">
            <div className="w-full aspect-[16/9] bg-gray-200 rounded-xs" />
            <div className="w-28 h-3.5 bg-gray-200 rounded" />
            <div className="w-full h-6 bg-gray-200 rounded" />
            <div className="w-4/5 h-6 bg-gray-200 rounded" />
            <div className="w-full h-12 bg-gray-100 rounded" />
            <div className="w-40 h-3 bg-gray-200 rounded mt-4" />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-24 h-16 bg-gray-200 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-full h-3.5 bg-gray-200 rounded" />
                  <div className="w-3/4 h-3.5 bg-gray-200 rounded" />
                  <div className="w-20 h-2.5 bg-gray-100 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : leadStory ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Major Lead Story: 7 cols */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#dcdcdc] pb-6 lg:pb-0 lg:pr-6">
            <div>
              <div className="mb-3.5">
                <ArticleThumbnail
                  src={leadStory.img_full_url || leadStory.img_thumb_url}
                  alt={leadStory.judul_artikel}
                  aspectRatio="landscape"
                  href={`/read/${leadStory.idart}/${leadStory.public_slug || leadStory.slug || "berita"}`}
                />
              </div>

              {leadStory.kabupaten && (
                <div className="flex items-center space-x-1 text-[#052962] mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {leadStory.kabupaten}
                  </span>
                </div>
              )}

              <ArticleHeadline
                title={leadStory.judul_artikel}
                href={`/read/${leadStory.idart}/${leadStory.public_slug || leadStory.slug || "berita"}`}
                variant="lead"
                lines={2}
              />

              <ArticleStandfirst
                content={leadStory.isi_artikel}
                lines={3}
                maxChars={180}
              />
            </div>

            <ArticleMeta
              author={leadStory.wartawan}
              date={leadStory.tanggal}
              views={leadStory.view}
              useRelativeTime={true}
              className="pt-3 mt-4"
            />
          </div>

          {/* 3 Secondary Stacked Stories: 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-gray-100">
            {sideStories.map((story) => (
              <EditorialHorizontalCard
                key={story.idart}
                article={story}
                kickerColor="#052962"
                showThumbnail={true}
                showStandfirst={true}
              />
            ))}

            {sideStories.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500 bg-gray-50 rounded-xs">
                <p className="text-xs italic mb-2">
                  Berita terkini lainnya dari wilayah ini sedang dihimpun.
                </p>
                {activeRegionObj?.idkab && (
                  <Link
                    href={`/daerah/${activeRegionObj.idkab}`}
                    className="inline-flex items-center text-xs font-semibold text-[#052962] hover:underline"
                  >
                    Buka arsip berita {selectedRegion}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xs">
          <p className="text-sm font-medium">
            Belum ada berita terbaru yang diunggah untuk wilayah <strong>{selectedRegion}</strong>.
          </p>
          <button
            onClick={() => handleSelectRegion("all")}
            className="mt-3 text-xs text-[#052962] underline font-bold"
          >
            Tampilkan seluruh daerah Lampung
          </button>
        </div>
      )}
    </section>
  );
}
