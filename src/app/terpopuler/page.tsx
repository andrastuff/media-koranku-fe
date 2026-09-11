import type { Metadata } from "next";
import Link from "next/link";
import { Eye, TrendingUp } from "lucide-react";
import ArticleThumbnail from "@/components/ui/ArticleThumbnail";
import ListingAd from "@/components/ads/ListingAd";
import ListingFilter from "@/components/listing/ListingFilter";
import ListingPageHeader from "@/components/listing/ListingPageHeader";
import ListingPagination from "@/components/listing/ListingPagination";
import { getAds, getPopularNewsList } from "@/lib/api";
import { formatDateIndo } from "@/lib/utils";

import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Berita Terpopuler",
  description: "Daftar berita terpopuler dan paling banyak dibaca di Provinsi Lampung dari redaksi korankuid.",
  alternates: {
    canonical: "/terpopuler",
  },
  openGraph: {
    title: "Berita Terpopuler - korankuid",
    description: "Daftar berita terpopuler dan paling banyak dibaca di Provinsi Lampung dari redaksi korankuid.",
    url: "https://korankuid.com/terpopuler",
    type: "website",
  },
};

interface PageProps { searchParams: Promise<{ page?: string; month?: string; year?: string }>; }

export default async function PopularPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const month = /^(?:[1-9]|1[0-2])$/.test(params.month || "") ? params.month || "" : "";
  const currentYear = new Date().getFullYear();
  const parsedYear = Number.parseInt(params.year || "", 10);
  const year = parsedYear >= 2000 && parsedYear <= currentYear + 1 ? String(parsedYear) : "";
  const [{ data: articles, pagination }, ads] = await Promise.all([
    getPopularNewsList({ page, limit: 12, month, year }),
    getAds("listing"),
  ]);
  const rankOffset = (page - 1) * 12;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  return (
    <div className="space-y-5 pb-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: siteUrl },
          { name: "Berita Terpopuler", url: `${siteUrl}/terpopuler` },
        ]}
      />
      <ListingPageHeader icon={TrendingUp} eyebrow="Peringkat pembaca" title="Berita Terpopuler" description="Diurutkan berdasarkan jumlah pembaca terbanyak." total={pagination?.total_records} />
      <ListingAd ad={ads[0]} />
      <ListingFilter action="/terpopuler" month={month} year={year} />

      {articles.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {articles.map((article, index) => {
            const href = `/read/${article.idart}/${article.public_slug || article.slug || "berita"}`;
            const rank = rankOffset + index + 1;
            return (
              <article key={article.idart} className={`group grid grid-cols-[2.25rem_7rem_minmax(0,1fr)] gap-3 rounded-md border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[2.75rem_9rem_minmax(0,1fr)] ${rank <= 3 ? "border-red-200 bg-red-50/30" : "border-slate-200 bg-white"}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full font-serif text-base font-black sm:h-10 sm:w-10 ${rank <= 3 ? "bg-brand-secondary text-white" : "border border-slate-200 text-brand-secondary"}`}>{rank}</span>
                <ArticleThumbnail src={article.img_thumb_url || article.img_full_url} alt={article.judul_artikel} aspectRatio="landscape" href={href} sizes="144px" />
                <div className="min-w-0 py-0.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-brand-secondary">{article.kategori || "Berita"}</span>
                  <Link href={href} className="mt-1 block"><h2 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-slate-950 transition-colors group-hover:text-[#052962] sm:text-base">{article.judul_artikel}</h2></Link>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-600"><Eye className="h-3.5 w-3.5 text-brand-secondary" />{new Intl.NumberFormat("id-ID").format(Number(article.view) || 0)} pembaca</span>
                    <span>{formatDateIndo(article.tanggal)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><TrendingUp className="mx-auto mb-3 h-9 w-9 text-slate-300" /><h2 className="font-serif text-xl font-bold text-slate-800">Belum ada berita pada periode ini</h2><p className="mt-1 text-sm text-slate-500">Coba pilih bulan atau tahun lainnya.</p></div>
      )}

      <ListingPagination basePath="/terpopuler" page={page} totalPages={pagination?.total_pages || 1} params={{ month, year }} />
    </div>
  );
}
