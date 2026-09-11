import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ListingPaginationProps { basePath: string; page: number; totalPages: number; params?: Record<string, string>; }

function buildHref(basePath: string, page: number, params: Record<string, string>) {
  const query = new URLSearchParams({ page: String(page) });
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  return `${basePath}?${query.toString()}`;
}

export default function ListingPagination({ basePath, page, totalPages, params = {} }: ListingPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-between border-t border-slate-200 pt-5">
      {page > 1 ? <Link href={buildHref(basePath, page - 1, params)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-brand-secondary hover:text-brand-secondary"><ArrowLeft className="h-4 w-4" />Sebelumnya</Link> : <span />}
      <span className="text-xs font-medium text-slate-500">Halaman {page} dari {totalPages}</span>
      {page < totalPages ? <Link href={buildHref(basePath, page + 1, params)} className="inline-flex items-center gap-2 rounded-md bg-[#052962] px-4 py-2 text-xs font-bold text-white hover:bg-[#041f4a]">Berikutnya<ArrowRight className="h-4 w-4" /></Link> : <span />}
    </nav>
  );
}
