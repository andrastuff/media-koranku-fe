import type { Metadata } from "next";
import { Search } from "lucide-react";
import EditorialCard from "@/components/cards/EditorialCard";
import ListingAd from "@/components/ads/ListingAd";
import ListingFilter from "@/components/listing/ListingFilter";
import ListingPageHeader from "@/components/listing/ListingPageHeader";
import ListingPagination from "@/components/listing/ListingPagination";
import { getAds, searchNews } from "@/lib/api";

interface SearchPageProps { searchParams: Promise<{ q?: string; page?: string; month?: string; year?: string }>; }

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil Pencarian: "${q}"` : "Pencarian Berita",
    description: q ? `Hasil pencarian berita terkait "${q}" di portal berita korankuid.` : "Pencarian arsip berita dan laporan investigasi korankuid.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const month = /^(?:[1-9]|1[0-2])$/.test(params.month || "") ? params.month || "" : "";
  const currentYear = new Date().getFullYear();
  const parsedYear = Number.parseInt(params.year || "", 10);
  const year = parsedYear >= 2000 && parsedYear <= currentYear + 1 ? String(parsedYear) : "";
  const [result, ads] = await Promise.all([
    q ? searchNews(q, page, 12, { month, year }) : Promise.resolve({ data: [], pagination: undefined }),
    getAds("listing"),
  ]);
  const { data: articles, pagination } = result;

  return (
    <div className="space-y-5 pb-6">
      <ListingPageHeader icon={Search} eyebrow="Arsip korankuid" title="Pencarian Berita" description="Temukan berita berdasarkan kata kunci dan periode penerbitan." total={q ? pagination?.total_records : undefined} />
      <ListingAd ad={ads[0]} />
      <ListingFilter action="/pencarian" keyword={q} showKeyword month={month} year={year} submitLabel="Cari" />

      {q ? (
        <section>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-serif text-xl font-bold text-slate-900">Hasil untuk &ldquo;{q}&rdquo;</h2>
            <span className="text-xs text-slate-500">{new Intl.NumberFormat("id-ID").format(pagination?.total_records || 0)} artikel</span>
          </div>
          {articles.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => <div key={article.idart} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]"><EditorialCard article={article} aspectRatio="video" borderRight={false} borderBottom={false} /></div>)}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Search className="mx-auto mb-3 h-10 w-10 text-slate-300" /><h2 className="font-serif text-xl font-bold text-slate-800">Berita tidak ditemukan</h2><p className="mt-1 text-sm text-slate-500">Coba kata kunci atau periode lainnya.</p></div>
          )}
        </section>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Search className="mx-auto mb-3 h-10 w-10 text-slate-300" /><h2 className="font-serif text-xl font-bold text-slate-800">Mulai pencarian</h2><p className="mt-1 text-sm text-slate-500">Masukkan kata kunci, lalu gunakan bulan dan tahun bila diperlukan.</p></div>
      )}

      <ListingPagination basePath="/pencarian" page={page} totalPages={pagination?.total_pages || 1} params={{ q, month, year }} />
    </div>
  );
}
