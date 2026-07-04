"use client";

import { useRouter } from "next/navigation";
import { jumpToHomeSection } from "@/lib/scroll-nav";

export function BackToPortfolioLink({
  target = "#projects",
  label = "포트폴리오로",
}: {
  target?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => jumpToHomeSection(target, (p) => router.push(p))}
      className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
    >
      <span aria-hidden>←</span> {label}
    </button>
  );
}
