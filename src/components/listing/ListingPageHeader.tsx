import type { LucideIcon } from "lucide-react";

interface ListingPageHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  total?: number;
}

export default function ListingPageHeader({ icon: Icon, eyebrow, title, description, total }: ListingPageHeaderProps) {
  return (
    <header className="overflow-hidden rounded-md bg-[#052962] text-white shadow-sm">
      <div className="h-1 bg-brand-secondary" />
      <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-6">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-red-200">
            <Icon className="h-4 w-4" aria-hidden="true" />{eyebrow}
          </span>
          <h1 className="font-serif text-2xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-blue-100/80 sm:text-sm">{description}</p>
        </div>
        {typeof total === "number" && (
          <div className="text-left sm:text-right">
            <strong className="block font-serif text-2xl text-white">{new Intl.NumberFormat("id-ID").format(total)}</strong>
            <span className="text-[10px] uppercase tracking-wider text-blue-200/70">artikel</span>
          </div>
        )}
      </div>
    </header>
  );
}
