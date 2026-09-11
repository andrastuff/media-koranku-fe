import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag } from "lucide-react";
import { getPopularNews, getRecentNews, getTagNews, getTags } from "@/lib/api";
import EditorialGridCard from "@/components/cards/EditorialGridCard";
import ListingPageHeader from "@/components/listing/ListingPageHeader";
import ListingPagination from "@/components/listing/ListingPagination";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import LatestSidebar from "@/components/sidebar/LatestSidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function labelFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = labelFromSlug(slug);
  return {
    title: `Fokus ${label}`,
    description: `Kumpulan berita terbaru dengan topik ${label} di korankuid.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageValue } = await searchParams;
  const currentPage = Math.max(1, Number(pageValue) || 1);
  const [result, tags, popular, latest] = await Promise.all([
    getTagNews(slug, currentPage, 12),
    getTags(),
    getPopularNews(5),
    getRecentNews(5),
  ]);
  const activeTag = tags.find((tag) => tag.tag_seo === slug);
  const label = activeTag?.nama_tag || labelFromSlug(slug);
  if (!activeTag && result.data.length === 0) notFound();

  return (
    <div className="py-2">
      <nav aria-label="Navigasi remah roti" className="mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2 text-xs text-gray-500">
        <Link href="/" className="font-semibold hover:text-[#052962]">Beranda</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800">Fokus {label}</span>
      </nav>

      <ListingPageHeader
        icon={Tag}
        eyebrow="Topik berita"
        title={label}
        description={`Berita terbaru dalam fokus ${label}.`}
        total={result.pagination?.total_records}
      />

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <main className="lg:col-span-8">
          {result.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {result.data.map((article) => (
                <div key={article.idart} className="overflow-hidden rounded-sm border border-gray-200 bg-white">
                  <EditorialGridCard article={article} variant="secondary" showStandfirst />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">Belum ada berita pada topik ini.</div>
          )}
          <ListingPagination page={currentPage} totalPages={result.pagination?.total_pages || 1} basePath={`/tag/${slug}`} />
        </main>
        <aside className="space-y-6 lg:col-span-4">
          <PopularSidebar articles={popular} />
          <LatestSidebar articles={latest} />
        </aside>
      </div>
    </div>
  );
}
