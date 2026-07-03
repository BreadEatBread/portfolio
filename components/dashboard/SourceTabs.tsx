"use client";

import { useState } from "react";

export type SourceFile = {
  path: string;
  language: string;
  content: string;
};

type Props = { files: SourceFile[] };

export function SourceTabs({ files }: Props) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = files[active];
  const lines = file.content.replace(/\n$/, "").split("\n");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 실패는 조용히 무시
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={f.path}
              onClick={() => setActive(i)}
              className={`px-4 py-3 text-xs font-mono whitespace-nowrap border-r border-border transition-colors ${
                i === active
                  ? "text-foreground bg-background/50"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f.path}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            {file.language}
          </span>
          <button
            onClick={onCopy}
            className="font-mono text-[10px] text-muted hover:text-foreground transition-colors"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
        <table className="min-w-full font-mono text-[12px] leading-[1.55]">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="select-none pr-4 pl-4 text-right text-muted/60 tabular-nums align-top w-12 border-r border-border/40">
                  {i + 1}
                </td>
                <td className="whitespace-pre pl-4 pr-6 py-[1px] text-foreground/90">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
