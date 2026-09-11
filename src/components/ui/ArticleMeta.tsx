import React from "react";
import { formatTimeAgo, formatDateIndo } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";

interface ArticleMetaProps {
  author?: string;
  date?: string;
  views?: string | number;
  useRelativeTime?: boolean;
  className?: string;
}

export default function ArticleMeta({
  author,
  date,
  views,
  useRelativeTime = true,
  className = "",
}: ArticleMetaProps) {
  const formattedDate = useRelativeTime ? formatTimeAgo(date) : formatDateIndo(date);

  return (
    <div
      className={`flex items-center justify-between text-[11px] text-gray-500 pt-2.5 mt-2 border-t border-gray-100/80 ${className}`}
    >
      <div className="flex items-center space-x-1.5 truncate max-w-[65%]">
        {author ? (
          <span className="font-semibold text-gray-800 truncate">
            {author}
          </span>
        ) : (
          <span className="font-medium text-gray-600">Redaksi</span>
        )}
      </div>

      <div className="flex items-center space-x-2.5 shrink-0 text-gray-400">
        {date && (
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>{formattedDate}</span>
          </span>
        )}

        {views && (
          <span className="hidden sm:flex items-center space-x-1">
            <Eye className="w-3 h-3 text-gray-400" />
            <span>{views}</span>
          </span>
        )}
      </div>
    </div>
  );
}
