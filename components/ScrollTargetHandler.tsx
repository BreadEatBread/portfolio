"use client";

import { useEffect } from "react";
import { consumePendingScrollTarget, scrollToId } from "@/lib/scroll-nav";

export function ScrollTargetHandler() {
  useEffect(() => {
    const id = consumePendingScrollTarget();
    if (!id) return;
    const raf = window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToId(id), 30);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);
  return null;
}
