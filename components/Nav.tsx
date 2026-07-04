"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { openCommandPalette } from "@/components/CommandPalette";
import { nav, profile } from "@/lib/data";

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Link
          href="#top"
          onClick={() => setOpen(false)}
          className="text-sm font-medium tracking-tight text-foreground hover:text-muted transition-colors"
        >
          {profile.name}
          <span className="hidden sm:inline text-muted ml-2 font-mono text-xs">
            /{profile.nameEn}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="커맨드 팔레트 열기"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 h-7 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <span aria-hidden>⌘</span>
            <span>K</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 -mr-2 rounded text-muted hover:text-foreground transition-colors"
          >
            <span className="sr-only">메뉴</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden
              className="stroke-current"
            >
              <line
                x1="2"
                x2="16"
                y1={open ? "9" : "5"}
                y2={open ? "9" : "5"}
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ transform: open ? "rotate(45deg)" : "none", transformOrigin: "9px 9px", transition: "transform 180ms ease" }}
              />
              <line
                x1="2"
                x2="16"
                y1="9"
                y2="9"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ opacity: open ? 0 : 1, transition: "opacity 120ms ease" }}
              />
              <line
                x1="2"
                x2="16"
                y1={open ? "9" : "13"}
                y2={open ? "9" : "13"}
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ transform: open ? "rotate(-45deg)" : "none", transformOrigin: "9px 9px", transition: "transform 180ms ease" }}
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden border-t border-border transition-[max-height] duration-200 ease-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="px-6 py-3 flex flex-col">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCommandPalette();
            }}
            className="flex items-center justify-between py-3 text-sm text-foreground hover:text-muted transition-colors border-b border-border/60 text-left"
          >
            <span>검색 · 커맨드 팔레트</span>
            <span
              aria-hidden
              className="font-mono text-[10px] text-muted uppercase tracking-widest"
            >
              ⌘K
            </span>
          </button>
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between py-3 text-sm text-foreground hover:text-muted transition-colors ${
                i < nav.length - 1 ? "border-b border-border/60" : ""
              }`}
            >
              <span>{item.label}</span>
              <span
                aria-hidden
                className="font-mono text-[10px] text-muted uppercase tracking-widest"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
