import React from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { TrendingUp, ArrowRight, Eye } from "lucide-react";

interface PopularSidebarProps {
  articles: Article[];
}

export default function PopularSidebar({ articles }: PopularSidebarProps) {
  if (!articles || articles.length === 0) return null;

  const visibleArticles = articles.slice(0, 5);
  const maxViews = Math.max(...visibleArticles.map((article) => Number(article.view) || 0), 1);
  const formatViews = (views?: string | number) =>
    new Intl.NumberFormat("id-ID").format(Number(views) || 0);

  return (
    <aside className="flex flex-col justify-between overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div>
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-secondary text-white shadow-sm">
            <TrendingUp className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-black tracking-tight text-slate-950">
              Terpopuler
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
              Paling banyak dibaca
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-3">
          {visibleArticles.map((article, idx) => {
            const slug = article.public_slug || article.slug || "berita";
            const href = `/read/${article.idart}/${slug}`;
            const views = Number(article.view) || 0;

            return (
              <Link
                key={article.idart}
                href={href}
                className={`group flex items-start gap-3 px-1 py-3 transition-colors hover:bg-slate-50 ${idx === 0 ? "bg-red-50/40" : ""}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-sm font-black ${idx < 3 ? "bg-brand-secondary text-white" : "border border-slate-200 text-brand-secondary"}`}>
                  {idx + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[9px] font-black uppercase tracking-[0.1em] text-brand-secondary">
                      {article.kategori || "Berita"}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[9px] font-medium text-slate-400">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {formatViews(article.view)}
                    </span>
                  </div>
                  <h4 className="line-clamp-2 font-serif text-[13px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#052962]">
                    {article.judul_artikel}
                  </h4>
                  <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-brand-secondary/70"
                      style={{ width: `${Math.max(12, (views / maxViews) * 100)}%` }}
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 p-3">
        <Link
          href="/terpopuler"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#052962] px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#041f4a]"
        >
          <span>Lihat Selengkapnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
