import React from "react";
import Link from "next/link";

interface ArticleHeadlineProps {
  title: string;
  href: string;
  variant?: "hero" | "lead" | "primary" | "secondary" | "compact" | "minimal";
  kicker?: string;
  kickerColor?: string;
  className?: string;
  lines?: number;
}

export default function ArticleHeadline({
  title,
  href,
  variant = "primary",
  kicker,
  kickerColor = "#cc0000",
  className = "",
  lines,
}: ArticleHeadlineProps) {
  // Typography variant classes
  const variantStyles = {
    hero: "font-serif text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.15] tracking-tight text-gray-950",
    lead: "font-serif text-xl sm:text-2xl md:text-[1.65rem] font-bold leading-snug tracking-tight text-gray-950",
    primary: "font-serif text-lg sm:text-xl font-bold leading-snug text-gray-900",
    secondary: "font-serif text-base sm:text-lg font-bold leading-snug text-gray-900",
    compact: "font-serif text-sm sm:text-base font-bold leading-snug text-gray-900",
    minimal: "font-serif text-xs sm:text-sm font-semibold leading-snug text-gray-800",
  };

  const lineClampClass = lines
    ? lines === 1
      ? "line-clamp-1"
      : lines === 2
      ? "line-clamp-2"
      : lines === 3
      ? "line-clamp-3"
      : `line-clamp-${lines}`
    : variant === "compact" || variant === "minimal"
    ? "line-clamp-2"
    : "";

  return (
    <div className={`group/headline ${className}`}>
      {kicker && (
        <span
          className="inline-block text-[11px] font-black uppercase tracking-wider mb-1.5 mr-2"
          style={{ color: kickerColor }}
        >
          {kicker}
        </span>
      )}

      <Link href={href} className="block">
        <h3
          className={`${variantStyles[variant]} ${lineClampClass} group-hover/headline:text-[#052962] group-hover/headline:underline decoration-1 underline-offset-2 transition-colors`}
        >
          {title}
        </h3>
      </Link>
    </div>
  );
}
