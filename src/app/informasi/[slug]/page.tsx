import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStaticPageDetail, getPopularNews } from "@/lib/api";
import PopularSidebar from "@/components/sidebar/PopularSidebar";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ChevronRight, FileText } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getStaticPageDetail(slug);

  if (!page) {
    return { title: "Halaman Tidak Ditemukan" };
  }

  const cleanDescription = page.content
    ? page.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    : `Informasi resmi ${page.judul} redaksi korankuid.`;

  return {
    title: page.judul,
    description: cleanDescription,
    alternates: {
      canonical: `/informasi/${slug}`,
    },
    openGraph: {
      title: `${page.judul} - korankuid`,
      description: cleanDescription,
      url: `https://korankuid.com/informasi/${slug}`,
      type: "article",
    },
  };
}

export default async function StaticInfoPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, popular] = await Promise.all([
    getStaticPageDetail(slug),
    getPopularNews(5),
  ]);

  if (!page) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://korankuid.com";

  return (
    <div className="py-2">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: siteUrl },
          { name: "Informasi", url: `${siteUrl}/informasi/${slug}` },
          { name: page.judul, url: `${siteUrl}/informasi/${slug}` },
        ]}
      />
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
        <Link href="/" className="hover:text-[#052962] font-semibold">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-700">Informasi</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">{page.judul}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: 8 cols */}
        <main className="lg:col-span-8 bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs shadow-2xs">
          <div className="border-b-2 border-[#052962] pb-4 mb-6">
            <span className="text-[11px] font-black uppercase text-[#052962] tracking-wider block mb-1">
              Informasi Resmi
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-gray-950">
              {page.judul}
            </h1>
          </div>

          {/* Render editor content */}
          <div
            className="article-content prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: page.content || "<p>Belum ada konten.</p>" }}
          />
        </main>

        {/* Sidebar: 4 cols */}
        <aside className="lg:col-span-4 space-y-6">
          <PopularSidebar articles={popular} />

          {/* Other Static Info Links */}
          <div className="bg-white border border-[#dcdcdc] p-4 rounded-xs">
            <h3 className="font-serif text-sm font-bold uppercase tracking-tight text-gray-950 pb-2 border-b border-gray-200 mb-3">
              Informasi Lainnya
            </h3>
            <div className="space-y-1 text-xs">
              <Link
                href="/informasi/tentang-kami"
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962]"
              >
                <span>Tentang Kami</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/informasi/redaksi"
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962]"
              >
                <span>Susunan Redaksi</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/informasi/pedoman-media-siber"
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962]"
              >
                <span>Pedoman Media Siber</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/informasi/disclaimer"
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962]"
              >
                <span>Disclaimer / Penyangkalan</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
              <Link
                href="/kontak"
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#052962]"
              >
                <span>Kontak & Pasang Iklan</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
