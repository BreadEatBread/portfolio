"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { Section } from "./Section";

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

type Item =
  | { kind: "copy"; label: string; value: string }
  | { kind: "link"; label: string; value: string; href: string };

const items: Item[] = [
  { kind: "copy", label: "Email", value: profile.email },
  ...(profile.github
    ? [
        {
          kind: "link" as const,
          label: "GitHub",
          value: stripProtocol(profile.github),
          href: profile.github,
        },
      ]
    : []),
  ...(profile.linkedin
    ? [
        {
          kind: "link" as const,
          label: "LinkedIn",
          value: stripProtocol(profile.linkedin),
          href: profile.linkedin,
        },
      ]
    : []),
];

export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => {
        setCopied((c) => (c === value ? null : c));
      }, 1600);
    } catch {
      // clipboard 접근 실패 시 조용히 무시
    }
  }

  return (
    <Section id="contact" eyebrow="06 · Contact" title="연락하기">
      <div className="space-y-6">
        <p className="text-base sm:text-lg leading-relaxed text-muted">
          함께 만들고 싶은 제품이 있거나, 그냥 커피 한 잔 하고 싶으시다면
          <br className="hidden sm:block" />
          언제든 메일 주세요.
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={item.label}>
              {item.kind === "copy" ? (
                <button
                  type="button"
                  onClick={() => copy(item.value)}
                  aria-label={`${item.label} 주소 ${item.value} 복사`}
                  className="group w-full flex items-center justify-between py-5 text-foreground hover:text-muted transition-colors text-left"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {item.label}
                  </span>
                  <span className="flex items-center gap-3 text-base min-w-0">
                    <span className="truncate">{item.value}</span>
                    <span
                      aria-hidden
                      className={`inline-flex items-center justify-center min-w-[52px] font-mono text-[10px] uppercase tracking-widest transition-colors ${
                        copied === item.value
                          ? "text-emerald-400"
                          : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {copied === item.value ? "COPIED" : "COPY"}
                    </span>
                  </span>
                </button>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 text-foreground hover:text-muted transition-colors"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {item.label}
                  </span>
                  <span className="flex items-center gap-3 text-base min-w-0">
                    <span className="truncate">{item.value}</span>
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
