import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import SectionHeader from "@/components/ui/SectionHeader";

interface LatestNewsSectionProps {
  articles: Article[];
}

export default function LatestNewsSection({ articles }: LatestNewsSectionProps) {
  const latestArticles = articles.slice(0, 6);
  if (!latestArticles.length) return null;

  return (
    <section className="rounded-xs border border-[#dcdcdc] bg-white p-3.5 shadow-2xs sm:p-4">
      <SectionHeader
        title="Berita Terbaru"
        href="/terbaru"
        kicker="Baru dari redaksi"
        accentColor="#052962"
        className="mb-3"
      />

      <div className="grid overflow-hidden rounded-sm border border-slate-100 md:grid-cols-2">
        {latestArticles.map((article, index) => {
          const href = `/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
          return (
            <article
              key={article.idart}
              className={`group grid grid-cols-[1.6rem_minmax(0,1fr)_5rem] items-center gap-3 border-slate-100 px-3 py-3.5 sm:grid-cols-[1.8rem_minmax(0,1fr)_6rem] sm:px-4 ${index < latestArticles.length - 1 ? "border-b" : ""} ${index % 2 === 0 ? "md:border-r" : ""} ${index >= latestArticles.length - 2 ? "md:border-b-0" : ""}`}
            >
              <span className="self-start pt-0.5 font-serif text-lg font-black text-slate-300 transition-colors group-hover:text-brand-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-brand-secondary">{article.kategori || "Berita"}</span>
                  <time className="text-[9px] font-medium text-slate-400" dateTime={article.tanggal}>{formatTimeAgo(article.tanggal)}</time>
                </div>
                <Link href={href}>
                  <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-slate-950 transition-colors group-hover:text-[#052962] sm:text-base">
                    {article.judul_artikel}
                  </h3>
                </Link>
              </div>
              <ArticleThumbnail
                src={article.img_thumb_url || article.img_full_url}
                alt={article.judul_artikel}
                aspectRatio="landscape"
                href={href}
                sizes="96px"
              />
            </article>
          );
        })}
      </div>

    </section>
  );
}
