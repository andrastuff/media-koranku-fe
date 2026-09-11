import React from "react";
import { getAds, getHomeData, getRegions, getVideos } from "@/lib/api";
import HeroCarouselSection from "@/components/sections/HeroCarouselSection";
import SentilanSection from "@/components/sections/SentilanSection";
import RubrikFeedSection from "@/components/sections/RubrikFeedSection";
import DaerahSection from "@/components/sections/DaerahSection";
import VideoGallerySection from "@/components/sections/VideoGallerySection";
import AdBanner from "@/components/ads/AdBanner";

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const [homeData, regions, videoData, sidebarAds, daerahAds, footerAds] = await Promise.all([
    getHomeData(),
    getRegions(),
    getVideos(),
    getAds("sidebar"),
    getAds("bawah daerah"),
    getAds("atas footer"),
  ]);

  const headlines = homeData?.headlines || [];
  const hotnews = homeData?.hotnews || [];
  const popular = homeData?.popular || [];
  const categoriesFeed = homeData?.categories_feed || {};
  const daerahNews = homeData?.daerah || [];

  // Extract rubriks from categories_feed
  const sentilanNews = categoriesFeed["nyekhita"] || categoriesFeed["sentilan"] || [];
  const opiniNews = categoriesFeed["opini"] || [];
  const hukumNews = categoriesFeed["hukum"] || categoriesFeed["hukum-kriminal"] || [];
  const politikNews = categoriesFeed["politik"] || [];
  const pemerintahanNews = categoriesFeed["pemerintahan"] || [];
  const pendidikanNews = categoriesFeed["pendidikan"] || [];
  const olahragaNews = categoriesFeed["gelanggang"] || categoriesFeed["olahraga"] || [];
  const budayaNews = categoriesFeed["seni budaya"] || categoriesFeed["pariwisata"] || categoriesFeed["seni-budaya"] || [];
  const ekonomiNews = categoriesFeed["ekonomi"] || categoriesFeed["ekonomi-bisnis"] || [];
  const sosokNews = categoriesFeed["wawancara"] || categoriesFeed["sosok"] || [];
  const nasionalNews = categoriesFeed["nasional"] || categoriesFeed["umum"] || [];

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. HERO LEAD SECTION (1 Grid Lead Story on Top, 2 Grid Secondary Below + 5 Terpopuler) */}
      <HeroCarouselSection
        headlines={headlines}
        featuredNews={hotnews}
        popular={popular}
        sidebarAd={sidebarAds[0]}
      />

      {/* 2. SENTILAN & OPINI SHOWCASE (Warm Paper Tint `#fef6eb`) */}
      <SentilanSection
        articles={sentilanNews}
        opiniArticles={opiniNews}
      />

      {/* 3. HUKUM & KRIMINAL (Full-Width Major Rubrik) */}
      <RubrikFeedSection
        title="Hukum & Kriminal"
        slug="hukum-kriminal"
        articles={hukumNews}
        accentColor="#cc0000"
        description="Laporan investigasi, perkara kejaksaan, pengadilan, dan kepolisian"
        layout="full"
      />

      {/* 4. POLITIK & PEMERINTAHAN (2-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <RubrikFeedSection
          title="Politik"
          slug="politik"
          articles={politikNews}
          accentColor="#005689"
          description="Dinamika parlemen, pilkada, parpol, dan kebijakan publik"
          layout="compact"
        />

        <RubrikFeedSection
          title="Pemerintahan"
          slug="pemerintahan"
          articles={pemerintahanNews}
          accentColor="#333333"
          description="Pelayanan publik dan agenda Pemerintah Daerah Lampung"
          layout="compact"
        />
      </div>

      {/* 5. INTERACTIVE KABAR DAERAH HUB (15 Kabupaten/Kota) */}
      <DaerahSection
        initialArticles={daerahNews}
        regions={regions}
      />

      {/* SPACE IKLAN 1: DIBAWAH KABAR DAERAH (TERHUBUNG KE tbl_ads) */}
      <AdBanner
        ad={daerahAds?.[0]}
        sizeText="FORMAT BANNER 970 × 250 PX"
        ariaLabel="Space Iklan Kabar Daerah"
      />

      {/* 6. SOSOK & PENDIDIKAN (2-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <RubrikFeedSection
          title="Sosok & Wawancara"
          slug="sosok"
          articles={sosokNews}
          accentColor="#052962"
          description="Wawancara khusus, figur inspirator, dan profil tokoh berprestasi"
          layout="compact"
        />

        <RubrikFeedSection
          title="Pendidikan"
          slug="pendidikan"
          articles={pendidikanNews}
          accentColor="#185e30"
          description="Kabar dunia kampus, sekolah, beasiswa, dan literasi riset"
          layout="compact"
        />
      </div>

      {/* 7. EKONOMI & BISNIS & OLAHRAGA (2-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <RubrikFeedSection
          title="Ekonomi & Bisnis"
          slug="ekonomi-bisnis"
          articles={ekonomiNews}
          accentColor="#805000"
          description="Dinamika perbankan, pasar modal, inflasi, dan UMKM Lampung"
          layout="compact"
        />

        <RubrikFeedSection
          title="Olahraga"
          slug="olahraga"
          articles={olahragaNews}
          accentColor="#0084c6"
          description="Kompetisi sepakbola, PON, dan prestasi atlet daerah"
          layout="compact"
        />
      </div>

      {/* 8. BUDAYA & PARIWISATA & NASIONAL (2-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <RubrikFeedSection
          title="Budaya & Pariwisata"
          slug="budaya-pariwisata"
          articles={budayaNews}
          accentColor="#8b2252"
          description="Eksotisme wisata Lampung, seni tradisi, dan ragam kuliner khas"
          layout="compact"
        />

        <RubrikFeedSection
          title="Kabar Nasional"
          slug="nasional"
          articles={nasionalNews}
          accentColor="#b30000"
          description="Sorotan peristiwa penting dan kebijakan dari pusat pemerintahan"
          layout="compact"
        />
      </div>

      {/* 9. KORANKUID TV & MULTIMEDIA */}
      {videoData && (
        <VideoGallerySection
          featuredVideos={videoData.featured_youtube}
          videoArticles={videoData.video_articles}
        />
      )}

      {/* 10. SPACE IKLAN 2: DI ATAS FOOTER (Antara korankuid TV & Footer - TERHUBUNG KE tbl_ads) */}
      <AdBanner
        ad={footerAds?.[0]}
        sizeText="FORMAT BANNER 970 × 250 PX"
        ariaLabel="Space Iklan Atas Footer"
        className="!mb-0 mt-4"
      />
    </div>
  );
}
