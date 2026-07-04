"use client";

import type { StreamStatus } from "@/hooks/useDashboardStream";

export type DataSource = "server" | "client";

type Props = {
  source: DataSource;
  onChange: (v: DataSource) => void;
  status: StreamStatus;
};

const statusLabel: Record<StreamStatus, string> = {
  idle: "대기",
  connecting: "연결 중",
  connected: "연결됨",
  reconnecting: "재연결",
  error: "오류",
};

const statusStyle: Record<StreamStatus, { dot: string; text: string; ring: string }> = {
  idle: { dot: "bg-zinc-500", text: "text-zinc-400", ring: "" },
  connecting: { dot: "bg-amber-400", text: "text-amber-300", ring: "animate-pulse" },
  connected: { dot: "bg-emerald-400", text: "text-emerald-300", ring: "" },
  reconnecting: { dot: "bg-amber-400", text: "text-amber-300", ring: "animate-pulse" },
  error: { dot: "bg-rose-400", text: "text-rose-300", ring: "animate-pulse" },
};

export function SourceToggle({ source, onChange, status }: Props) {
  const s = statusStyle[status];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-4 p-4">
        <div className="min-w-[200px]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Data source
          </p>
          <p className="text-sm text-foreground">
            {source === "server" ? "서버에서 스트리밍" : "브라우저에서 시뮬레이션"}
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-border overflow-hidden">
          {(["server", "client"] as const).map((v) => {
            const active = v === source;
            const label = v === "server" ? "Server · SSE" : "Client · Simulator";
            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                aria-pressed={active}
                className={`px-3.5 h-8 font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {source === "server" && (
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${s.ring} ${s.dot}`}
              />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
            </span>
            <span className={`font-mono text-[11px] uppercase tracking-widest ${s.text}`}>
              {statusLabel[status]}
            </span>
            <code className="ml-2 font-mono text-[11px] text-muted">
              GET /api/dashboard/stream
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
