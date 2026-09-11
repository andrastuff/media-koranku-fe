import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Article } from "@/lib/types";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import { formatDateIndo } from "@/lib/utils";

interface LatestSidebarProps { articles: Article[]; }

export default function LatestSidebar({ articles }: LatestSidebarProps) {
  if (!articles.length) return null;
  return (
    <aside className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#052962] text-white"><Clock3 className="h-4.5 w-4.5" /></span>
        <div><h3 className="font-serif text-lg font-black text-slate-950">Terbaru</h3><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Baru dari redaksi</p></div>
      </div>
      <div className="divide-y divide-slate-100 px-3">
        {articles.slice(0, 5).map((article) => {
          const href = `/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
          return (
            <article key={article.idart} className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-3 py-3">
              <ArticleThumbnail src={article.img_thumb_url || article.img_full_url} alt={article.judul_artikel} aspectRatio="landscape" href={href} sizes="80px" />
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-brand-secondary">{article.kategori || "Berita"}</span>
                <Link href={href}><h4 className="mt-0.5 line-clamp-2 font-serif text-xs font-bold leading-snug text-slate-900 group-hover:text-[#052962]">{article.judul_artikel}</h4></Link>
                <span className="mt-1 block text-[9px] text-slate-400">{formatDateIndo(article.tanggal)}</span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="border-t border-slate-100 p-3">
        <Link href="/terbaru" className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#052962] hover:border-[#052962]">Lihat Berita Terbaru<ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </aside>
  );
}
