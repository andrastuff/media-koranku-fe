import React from "react";
import { Article, AdItem } from "@/lib/types";
import VideoCard from "@/components/cards/VideoCard";
import { Tv, ArrowRight } from "lucide-react";

interface VideoGallerySectionProps {
  featuredVideos?: AdItem[];
  videoArticles?: Article[];
}

export default function VideoGallerySection({
  featuredVideos = [],
  videoArticles = [],
}: VideoGallerySectionProps) {
  const hasVideos = featuredVideos.length > 0 || videoArticles.length > 0;
  if (!hasVideos) return null;

  return (
    <section className="my-6 bg-[#121212] text-white p-4 sm:p-6 rounded-xs border border-gray-800 shadow-2xs w-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#cc0000] text-white flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                korankuid TV
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Liputan video eksklusif, wawancara khusus, dan dokumentasi visual
              </p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/@korankuid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-brand-secondary hover:underline flex items-center gap-1"
          >
            Kunjungi Channel YouTube <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.slice(0, 3).map((video) => (
            <VideoCard key={video.idads} item={video} isAd={true} />
          ))}

          {videoArticles.slice(0, 3).map((article) => (
            <VideoCard key={article.idart} item={article} isAd={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
