import React from "react";
import Link from "next/link";
import { ArticlePageItem } from "@/lib/types";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface ArticlePaginationProps {
  pages: ArticlePageItem[];
  currentIdart: string | number;
}

export default function ArticlePagination({
  pages,
  currentIdart,
}: ArticlePaginationProps) {
  if (!pages || pages.length <= 1) {
    return null;
  }

  const currentIndex = pages.findIndex(
    (p) => String(p.idart) === String(currentIdart) || p.is_active
  );
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentPage = pages[activeIndex];
  const prevPage = activeIndex > 0 ? pages[activeIndex - 1] : null;
  const nextPage = activeIndex < pages.length - 1 ? pages[activeIndex + 1] : null;

  return (
    <nav
      aria-label="Navigasi halaman berita"
      className="my-8 p-5 bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 rounded-sm shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page status info */}
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <FileText className="w-4 h-4 text-[#052962]" />
          <span>
            Halaman <strong className="text-gray-950 font-bold">{currentPage.page_number}</strong> dari <strong className="text-gray-950 font-bold">{pages.length}</strong>
          </span>
        </div>

        {/* Buttons: Prev, Numbered, Next */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Previous Page Button */}
          {prevPage ? (
            <Link
              href={`/read/${prevPage.idart}/${prevPage.public_slug || "berita"}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:text-[#052962] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold text-gray-300 bg-gray-100/70 border border-gray-200 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </span>
          )}

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p) => {
              const isActive = String(p.idart) === String(currentIdart) || p.is_active;
              return (
                <Link
                  key={p.idart}
                  href={`/read/${p.idart}/${p.public_slug || "berita"}`}
                  className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#052962] text-white shadow-2xs scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {p.page_number}
                </Link>
              );
            })}
          </div>

          {/* Next Page Button */}
          {nextPage ? (
            <Link
              href={`/read/${nextPage.idart}/${nextPage.public_slug || "berita"}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-bold text-white bg-[#052962] hover:bg-[#041f4a] transition-colors shadow-2xs"
            >
              <span>Lanjut Halaman</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
              <span>Halaman Terakhir</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
