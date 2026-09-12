import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  kicker?: string;
  subtitle?: string;
  accentColor?: string;
  className?: string;
  rightElement?: React.ReactNode;
}

export default function SectionHeader({
  title,
  href,
  kicker,
  subtitle,
  accentColor = "#052962",
  className = "",
  rightElement,
}: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="h-px bg-slate-200">
        <div
          className="h-[3px] w-14 -translate-y-px rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="flex items-start justify-between gap-3 pt-3.5 sm:items-center sm:gap-4">
        <div className="min-w-0">
          {kicker && (
            <span
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: accentColor }}
            >
              {kicker}
            </span>
          )}

          {href ? (
            <Link href={href} className="group inline-block max-w-full">
              <h2
                className="font-serif text-[1.35rem] font-black leading-tight tracking-[-0.025em] transition-opacity group-hover:opacity-75 sm:text-[1.7rem]"
                style={{ color: accentColor }}
              >
                {title}
              </h2>
            </Link>
          ) : (
            <h2
              className="font-serif text-[1.35rem] font-black leading-tight tracking-[-0.025em] sm:text-[1.7rem]"
              style={{ color: accentColor }}
            >
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1.5 hidden max-w-2xl truncate text-xs leading-relaxed text-slate-500 sm:block">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 text-xs font-semibold">
          {rightElement}

          {href && (
            <Link
              href={href}
              aria-label={`Lihat berita ${title} selengkapnya`}
              className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-sm border border-slate-200 bg-white px-2.5 text-slate-600 shadow-xs transition-all hover:border-slate-300 hover:text-slate-950 sm:px-3"
            >
              <span className="hidden sm:inline">Selengkapnya</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
