"use client";

import React from "react";
import AdBanner from "./AdBanner";
import { AdItem } from "@/lib/types";

interface DaerahAdBannerProps {
  ad?: AdItem;
  className?: string;
}

export default function DaerahAdBanner({ ad, className = "" }: DaerahAdBannerProps) {
  return (
    <AdBanner
      ad={ad}
      sizeText="FORMAT BANNER 970 × 250 PX"
      className={className}
      ariaLabel="Space Iklan Kabar Daerah"
    />
  );
}
