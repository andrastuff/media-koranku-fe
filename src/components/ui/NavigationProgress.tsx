"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mounted = useRef(false);
  const safetyTimer = useRef<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    const timer = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    const startForLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (destination.origin !== current.origin) return;
      if (destination.pathname === current.pathname && destination.search === current.search) return;
      setLoading(true);
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
      safetyTimer.current = window.setTimeout(() => setLoading(false), 12000);
    };

    const startForHistory = () => {
      setLoading(true);
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
      safetyTimer.current = window.setTimeout(() => setLoading(false), 12000);
    };
    document.addEventListener("click", startForLink, true);
    window.addEventListener("popstate", startForHistory);
    return () => {
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
      document.removeEventListener("click", startForLink, true);
      window.removeEventListener("popstate", startForHistory);
    };
  }, []);

  return (
    <div
      className={`navigation-progress ${loading ? "navigation-progress--active" : ""}`}
      role="progressbar"
      aria-label="Memuat halaman"
      aria-hidden={!loading}
    />
  );
}
