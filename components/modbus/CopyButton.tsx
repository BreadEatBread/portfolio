"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "복사",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={onCopy}
      className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-foreground transition-colors"
    >
      {copied ? "COPIED" : label.toUpperCase()}
    </button>
  );
}
