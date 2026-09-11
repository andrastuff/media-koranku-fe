"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdItem } from "@/lib/types";

interface FloatingSideAdsProps {
  leftAd?: AdItem;
  rightAd?: AdItem;
}

function safeLink(link?: string) {
  return link && /^(https?:\/\/|\/)/i.test(link) ? link : undefined;
}

function FloatingAd({ ad, side, visible }: { ad?: AdItem; side: "left" | "right"; visible: boolean }) {
  const [closed, setClosed] = useState(false);
  const [failed, setFailed] = useState(false);
  const link = !failed ? safeLink(ad?.link) : undefined;
  const src = !failed && ad?.img_url ? ad.img_url : "/ads/floating-ad-placeholder.svg";
  const translate = side === "left" ? "-translate-x-[125%]" : "translate-x-[125%]";
  const position = side === "left"
    ? "left-[max(12px,calc((100vw-80rem)/2-172px))]"
    : "right-[max(12px,calc((100vw-80rem)/2-172px))]";

  if (closed) return null;

  const image = (
    <Image
      src={src}
      alt={ad?.keterangan || `Iklan vertikal ${side === "left" ? "kiri" : "kanan"}`}
      fill
      unoptimized
      sizes="160px"
      className="object-contain"
      onError={() => setFailed(true)}
    />
  );

  return (
    <aside
      aria-label={`Iklan desktop sisi ${side === "left" ? "kiri" : "kanan"}`}
      className={`fixed top-24 z-40 hidden aspect-[4/15] w-40 min-[1640px]:block ${position} transition-all duration-500 ease-out ${
        visible ? "translate-x-0 opacity-100" : `${translate} pointer-events-none opacity-0`
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">
        {link ? (
          <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel={link.startsWith("http") ? "noopener noreferrer sponsored" : undefined} className="block h-full w-full">
            {image}
          </a>
        ) : image}
      </div>
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label={`Tutup iklan sisi ${side === "left" ? "kiri" : "kanan"}`}
        className={`absolute -top-2.5 ${side === "left" ? "-right-2.5" : "-left-2.5"} grid h-7 w-7 place-items-center rounded-full border border-white/50 bg-slate-950 text-white shadow-md transition hover:bg-brand-secondary`}
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}

export default function FloatingSideAds({ leftAd, rightAd }: FloatingSideAdsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const desktop = window.matchMedia("(min-width: 1640px)");

    const update = () => {
      const nav = document.getElementById("sticky-site-navigation");
      const sticky = desktop.matches && window.scrollY > 60 && Boolean(nav && nav.getBoundingClientRect().top <= 1);

      if (sticky && !timer && !visible) {
        timer = setTimeout(() => {
          setVisible(true);
          timer = undefined;
        }, 2000);
      } else if (!sticky) {
        if (timer) clearTimeout(timer);
        timer = undefined;
        setVisible(false);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    desktop.addEventListener("change", update);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", update);
      desktop.removeEventListener("change", update);
    };
  }, [visible]);

  return (
    <>
      <FloatingAd ad={leftAd} side="left" visible={visible} />
      <FloatingAd ad={rightAd} side="right" visible={visible} />
    </>
  );
}
