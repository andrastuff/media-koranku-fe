import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";

interface LatestNewsSectionProps {
  articles: Article[];
}

export default function LatestNewsSection({ articles }: LatestNewsSectionProps) {
  const latestArticles = articles.slice(0, 5);
  if (!latestArticles.length) return null;

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.045)]">
      <div className="h-1 bg-brand-secondary" />
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#052962] text-white">
            <Clock3 className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-secondary">Baru dari redaksi</p>
            <h2 className="font-serif text-xl font-black leading-tight text-[#052962] sm:text-2xl">Berita Terbaru</h2>
          </div>
        </div>
        <Link href="/terbaru" className="hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#052962] transition hover:text-brand-secondary sm:flex">
          Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2">
        {latestArticles.map((article, index) => {
          const href = `/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
          return (
            <article
              key={article.idart}
              className={`group grid grid-cols-[1.6rem_minmax(0,1fr)_5rem] items-center gap-3 border-slate-100 px-4 py-3.5 sm:grid-cols-[1.8rem_minmax(0,1fr)_6rem] sm:px-6 ${index < latestArticles.length - 1 ? "border-b" : ""} ${index % 2 === 0 ? "md:border-r" : ""} ${index === latestArticles.length - 1 && index % 2 === 0 ? "md:col-span-2 md:grid-cols-[1.8rem_minmax(0,1fr)_7rem] md:border-r-0" : ""}`}
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

      <div className="border-t border-slate-100 p-3 sm:hidden">
        <Link href="/terbaru" className="flex items-center justify-center gap-2 rounded-md bg-[#052962] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
          Lihat Semua Berita Terbaru <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
