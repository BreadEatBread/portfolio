"use client";

import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/scroll-nav";

const SHOW_AFTER = 480;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 backdrop-blur px-3.5 h-9 font-mono text-xs text-muted shadow-lg transition-all duration-200 hover:text-foreground hover:border-foreground/30 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <span aria-hidden>↑</span>
      <span>맨 위로</span>
    </button>
  );
}
