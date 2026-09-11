import type { Metadata } from "next";
import { Clock3 } from "lucide-react";
import EditorialCard from "@/components/cards/EditorialCard";
import ListingAd from "@/components/ads/ListingAd";
import ListingFilter from "@/components/listing/ListingFilter";
import ListingPageHeader from "@/components/listing/ListingPageHeader";
import ListingPagination from "@/components/listing/ListingPagination";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getAds, getRecentNewsList } from "@/lib/api";
import { Article } from "@/lib/types";

export const metadata: Metadata = {
  title: "Berita Terbaru",
  description: "Daftar berita terbaru dan liputan terkini Provinsi Lampung dari redaksi korankuid.",
  alternates: {
    canonical: "/terbaru",
  },
  openGraph: {
    title: "Berita Terbaru - korankuid",
    description: "Daftar berita terbaru dan liputan terkini Provinsi Lampung dari redaksi korankuid.",
    url: "https://korankuid.com/terbaru",
    type: "website",
  },
};

interface PageProps { searchParams: Promise<{ page?: string; month?: string; year?: string }>; }

export default async function LatestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const month = /^(?:[1-9]|1[0-2])$/.test(params.month || "") ? params.month || "" : "";
  const currentYear = new Date().getFullYear();
  const parsedYear = Number.parseInt(params.year || "", 10);
  const year = parsedYear >= 2000 && parsedYear <= currentYear + 1 ? String(parsedYear) : "";
  const [{ data: articles, pagination }, ads] = await Promise.all([
    getRecentNewsList({ page, limit: 12, month, year }),
    getAds("listing"),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  return (
    <div className="space-y-5 pb-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: siteUrl },
          { name: "Berita Terbaru", url: `${siteUrl}/terbaru` },
        ]}
      />
      <ListingPageHeader icon={Clock3} eyebrow="Baru dari redaksi" title="Berita Terbaru" description="Kabar terkini diurutkan berdasarkan waktu penerbitan terbaru." total={pagination?.total_records} />
      <ListingAd ad={ads[0]} />
      <ListingFilter action="/terbaru" month={month} year={year} />

      {articles.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: Article) => <div key={article.idart} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]"><EditorialCard article={article} aspectRatio="video" borderRight={false} borderBottom={false} /></div>)}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Clock3 className="mx-auto mb-3 h-10 w-10 text-slate-300" /><h2 className="font-serif text-xl font-bold text-slate-800">Belum ada berita pada periode ini</h2><p className="mt-1 text-sm text-slate-500">Coba bulan atau tahun lainnya.</p></div>
      )}

      <ListingPagination basePath="/terbaru" page={page} totalPages={pagination?.total_pages || 1} params={{ month, year }} />
    </div>
  );
}
