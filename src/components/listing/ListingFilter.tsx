import Link from "next/link";
import { CalendarDays, Search } from "lucide-react";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

interface ListingFilterProps {
  action: string;
  month?: string;
  year?: string;
  keyword?: string;
  showKeyword?: boolean;
  submitLabel?: string;
}

export default function ListingFilter({ action, month = "", year = "", keyword = "", showKeyword = false, submitLabel = "Terapkan" }: ListingFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, index) => currentYear - index);
  const hasFilter = Boolean(keyword || month || year);

  return (
    <form action={action} method="GET" className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end">
      {showKeyword && (
        <div className="flex-[1.4]">
          <label htmlFor="q" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Kata kunci</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="q" name="q" type="search" defaultValue={keyword} placeholder="Cari judul atau isi berita..." className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15" />
          </div>
        </div>
      )}
      <div className="flex-1">
        <label htmlFor="month" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Bulan</label>
        <select id="month" name="month" defaultValue={month} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15">
          <option value="">Semua bulan</option>
          {MONTHS.map((monthName, index) => <option key={monthName} value={index + 1}>{monthName}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="year" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Tahun</label>
        <select id="year" name="year" defaultValue={year} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/15">
          <option value="">Semua tahun</option>
          {years.map((yearOption) => <option key={yearOption} value={yearOption}>{yearOption}</option>)}
        </select>
      </div>
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-secondary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-secondary-hover">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />{submitLabel}
      </button>
      {hasFilter && <Link href={action} className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-brand-secondary">Reset</Link>}
    </form>
  );
}
