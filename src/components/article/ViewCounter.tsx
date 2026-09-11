"use client";

import { useEffect } from "react";
import { incrementView } from "@/lib/client-api";

export default function ViewCounter({ idart }: { idart: string | number }) {
  useEffect(() => {
    incrementView(idart);
  }, [idart]);

  return null;
}
