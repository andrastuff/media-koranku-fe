"use client";

import React, { useState } from "react";
import { MessageCircle, Link as LinkIcon, Check } from "lucide-react";

interface ShareBarProps {
  title: string;
  url?: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareWhatsApp = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`${title} - korankuid: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${shareUrl}`, "_blank");
  };

  const shareFacebook = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank");
  };

  const shareTwitter = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, "_blank");
  };

  return (
    <div className="my-4 flex flex-wrap items-center gap-2 border-y border-gray-100 py-3">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-gray-500 sm:mr-2 sm:text-xs">
        Bagikan:
      </span>

      {/* WhatsApp */}
      <button
        onClick={shareWhatsApp}
        className="p-2 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
        title="Bagikan ke WhatsApp"
        aria-label="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Facebook SVG */}
      <button
        onClick={shareFacebook}
        className="p-2 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity flex items-center justify-center"
        title="Bagikan ke Facebook"
        aria-label="Bagikan ke Facebook"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* Twitter / X SVG */}
      <button
        onClick={shareTwitter}
        className="p-2 rounded-full bg-[#000000] text-white hover:opacity-90 transition-opacity flex items-center justify-center"
        title="Bagikan ke X"
        aria-label="Bagikan ke X"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Copy URL */}
      <button
        onClick={handleCopy}
        className="flex min-h-8 items-center space-x-1 rounded-full bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition-colors hover:bg-gray-200 sm:px-3 sm:text-xs"
        title="Salin Link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600">Tersalin!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5 text-gray-600" />
            <span>Salin URL</span>
          </>
        )}
      </button>
    </div>
  );
}
