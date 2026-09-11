import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getRegions, getHomeData } from "@/lib/api";
import EditorialCard from "@/components/cards/EditorialCard";
import { MapPin, ChevronRight } from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Kabar Daerah Lampung",
  description: "Informasi dan berita pembangunan dari 15 Kabupaten dan Kota di Provinsi Lampung.",
  alternates: {
    canonical: "/daerah",
  },
  openGraph: {
    title: "Kabar Daerah Lampung - korankuid",
    description: "Informasi dan berita pembangunan dari 15 Kabupaten dan Kota di Provinsi Lampung.",
    url: "https://korankuid.com/daerah",
  },
};

export default async function DaerahIndexPage() {
  const [regions, homeData] = await Promise.all([getRegions(), getHomeData()]);
  const daerahNews = homeData?.daerah || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  return (
    <div className="py-2">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: siteUrl },
          { name: "Kabar Daerah", url: `${siteUrl}/daerah` },
        ]}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800">Daerah</span>
      </nav>

      {/* Masthead */}
      <div className="border-b-4 border-[#052962] pb-6 mb-8">
        <span className="inline-block bg-[#052962] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs mb-2">
          Provinsi Lampung
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Kabar 15 Kabupaten & Kota
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Menyajikan dinamika pembangunan, kebijakan pemerintah daerah, pelayanan masyarakat, dan potensi unggulan daerah se-Provinsi Lampung.
        </p>
      </div>

      {/* District Cards Grid */}
      <div className="mb-12">
        <h2 className="font-serif text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#052962]" />
          Pilih Wilayah Kabupaten / Kota
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {regions.map((reg) => (
            <Link
              key={reg.idkab}
              href={`/daerah/${reg.idkab}`}
              className="p-3 bg-white border border-gray-200 rounded hover:border-[#052962] hover:bg-blue-50/50 transition-colors flex items-center justify-between group shadow-2xs"
            >
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#052962]">
                {reg.kabupaten}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#052962] shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Latest News Across Regions */}
      <div>
        <h2 className="font-serif text-2xl font-black text-gray-950 pb-2 border-b-2 border-gray-200 mb-6 uppercase tracking-tight">
          Berita Daerah Terkini
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {daerahNews.map((art) => (
            <div key={art.idart} className="bg-white border border-[#dcdcdc] rounded-xs overflow-hidden">
              <EditorialCard
                article={art}
                aspectRatio="video"
                borderRight={false}
                borderBottom={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
