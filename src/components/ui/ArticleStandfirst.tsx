import React from "react";
import { truncateText } from "@/lib/utils";

interface ArticleStandfirstProps {
  content?: string;
  lines?: number;
  variant?: "sans" | "serif";
  maxChars?: number;
  className?: string;
}

export default function ArticleStandfirst({
  content,
  lines = 2,
  variant = "sans",
  maxChars = 160,
  className = "",
}: ArticleStandfirstProps) {
  if (!content) return null;

  const cleanedText = truncateText(content, maxChars);
  if (!cleanedText) return null;

  const lineClampClass =
    lines === 1
      ? "line-clamp-1"
      : lines === 2
      ? "line-clamp-2"
      : lines === 3
      ? "line-clamp-3"
      : lines === 4
      ? "line-clamp-4"
      : lines === 10
      ? "line-clamp-[10]"
      : `line-clamp-${lines}`;

  const fontClass =
    variant === "serif"
      ? "font-serif text-gray-700 italic text-sm sm:text-base leading-relaxed"
      : "font-sans text-gray-600 text-xs sm:text-sm leading-relaxed";

  return (
    <p className={`${fontClass} ${lineClampClass} mt-2 ${className}`}>
      {cleanedText}
    </p>
  );
}
