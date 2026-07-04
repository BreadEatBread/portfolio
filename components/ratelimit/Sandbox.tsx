"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Algorithm,
  AlgorithmSnapshot,
  CheckResult,
} from "@/lib/ratelimit/algorithms";

const ALGO_META: Record<Algorithm, { title: string; description: string }> = {
  fixed_window: {
    title: "Fixed Window",
    description:
      "고정된 시간창(10초)에 요청 개수를 세어 한도(10건)를 넘으면 거부. 창 경계에서 카운터가 리셋.",
  },
  sliding_window: {
    title: "Sliding Window (log)",
    description:
      "지난 10초 동안의 실제 요청 타임스탬프를 유지하고, 그 안의 개수가 10을 넘으면 거부.",
  },
  token_bucket: {
    title: "Token Bucket",
    description:
      "용량 10 의 버킷이 초당 1개씩 채워짐. 요청마다 토큰 1개 소비. 버스트를 허용하되 평균 속도를 제한.",
  },
};

const TIMELINE_MS = 30_000;

type LogEntry = {
  id: string;
  ts: number;
  accepted: boolean;
  remaining: number;
  algorithm: Algorithm;
};

function generateClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function Sandbox() {
  const clientIdRef = useRef<string>("");
  if (!clientIdRef.current) clientIdRef.current = generateClientId();

  const [algorithm, setAlgorithm] = useState<Algorithm>("token_bucket");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [snapshot, setSnapshot] = useState<AlgorithmSnapshot | null>(null);
  const [now, setNow] = useState(Date.now());
  const [inflight, setInflight] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  const send = useCallback(async () => {
    setInflight((n) => n + 1);
    try {
      const res = await fetch("/api/ratelimit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: clientIdRef.current, algorithm }),
      });
      const data = (await res.json()) as CheckResult & { ts: number };
      const ts = data.ts ?? Date.now();
      setSnapshot(data.state);
      setLog((prev) =>
        [
          {
            id: `${ts}-${Math.random()}`,
            ts,
            accepted: data.accepted,
            remaining: data.remaining,
            algorithm: data.algorithm,
          },
          ...prev,
        ].slice(0, 200),
      );
    } catch {
      // ignore transient network errors
    } finally {
      setInflight((n) => Math.max(0, n - 1));
    }
  }, [algorithm]);

  const burst = useCallback(
    async (count: number) => {
      for (let i = 0; i < count; i++) {
        void send();
        await new Promise((r) => setTimeout(r, 30));
      }
    },
    [send],
  );

  const reset = useCallback(() => {
    clientIdRef.current = generateClientId();
    setLog([]);
    setSnapshot(null);
  }, []);

  const recent = useMemo(
    () => log.filter((e) => e.ts >= now - TIMELINE_MS),
    [log, now],
  );

  const totals = useMemo(() => {
    const total = log.length;
    const accepted = log.filter((e) => e.accepted).length;
    const rejected = total - accepted;
    return { total, accepted, rejected };
  }, [log]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Algorithm
          </p>
          <div className="inline-flex items-center rounded-full border border-border overflow-hidden text-sm">
            {(["fixed_window", "sliding_window", "token_bucket"] as const).map(
              (a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAlgorithm(a)}
                  aria-pressed={a === algorithm}
                  className={`px-3.5 h-8 font-mono text-[11px] transition-colors ${
                    a === algorithm
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {ALGO_META[a].title}
                </button>
              ),
            )}
          </div>
          <p className="text-sm text-muted leading-relaxed">
            {ALGO_META[algorithm].description}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between gap-3 min-w-[220px]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Client ID
          </p>
          <p className="font-mono text-[11px] text-foreground truncate">
            {clientIdRef.current}
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 h-8 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors self-start"
          >
            <span aria-hidden>↻</span> 새 클라이언트
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={send}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 h-9 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          요청 1개 보내기
        </button>
        <button
          type="button"
          onClick={() => burst(5)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 h-9 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          버스트 5개
        </button>
        <button
          type="button"
          onClick={() => burst(15)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 h-9 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          버스트 15개
        </button>
        <span className="font-mono text-[11px] text-muted ml-2">
          in-flight {inflight}
        </span>
      </div>

      <Kpis totals={totals} snapshot={snapshot} now={now} />

      <Timeline entries={recent} now={now} />

      <AlgoState snapshot={snapshot} now={now} />
    </div>
  );
}

function Kpis({
  totals,
  snapshot,
  now,
}: {
  totals: { total: number; accepted: number; rejected: number };
  snapshot: AlgorithmSnapshot | null;
  now: number;
}) {
  const remaining = snapshot
    ? snapshot.kind === "fixed_window"
      ? snapshot.limit - snapshot.count
      : snapshot.kind === "sliding_window"
        ? snapshot.limit - snapshot.requests.length
        : Math.floor(snapshot.tokens)
    : "—";
  const resetIn = snapshot
    ? snapshot.kind === "fixed_window"
      ? Math.max(0, snapshot.windowEnd - now)
      : snapshot.kind === "sliding_window"
        ? snapshot.requests.length > 0
          ? Math.max(0, snapshot.requests[0] + snapshot.windowMs - now)
          : 0
        : 0
    : 0;

  const kpis = [
    { label: "총 요청", value: totals.total },
    { label: "허용", value: totals.accepted, color: "text-emerald-300" },
    { label: "거부 (429)", value: totals.rejected, color: "text-rose-300" },
    { label: "남은 예산", value: remaining },
    ...(resetIn > 0
      ? [{ label: "다음 리셋", value: `${(resetIn / 1000).toFixed(1)}s` }]
      : []),
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
            {k.label}
          </p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              k.color ?? "text-foreground"
            }`}
          >
            {k.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function Timeline({ entries, now }: { entries: LogEntry[]; now: number }) {
  const spanMs = TIMELINE_MS;
  const startMs = now - spanMs;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Timeline · 최근 30초
          </p>
          <h3 className="text-sm font-medium text-foreground">
            요청별 결과 · 초록=허용 · 빨강=429
          </h3>
        </div>
        <p className="font-mono text-[11px] text-muted">{entries.length}건</p>
      </div>
      <div className="relative h-16 rounded border border-border/60 bg-background/40 overflow-hidden">
        {/* Gridlines every 5s */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-border/40"
            style={{ left: `${(i / 6) * 100}%` }}
          />
        ))}
        {entries.map((e) => {
          const left = ((e.ts - startMs) / spanMs) * 100;
          return (
            <span
              key={e.id}
              className={`absolute top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full ${
                e.accepted ? "bg-emerald-400/80" : "bg-rose-400/80"
              }`}
              style={{ left: `${left}%` }}
              title={new Date(e.ts).toLocaleTimeString("ko-KR", { hour12: false })}
            />
          );
        })}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted">
        <span>-30s</span>
        <span>-15s</span>
        <span>지금</span>
      </div>
    </div>
  );
}

function AlgoState({
  snapshot,
  now,
}: {
  snapshot: AlgorithmSnapshot | null;
  now: number;
}) {
  if (!snapshot) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted">
        요청을 보내면 알고리즘 내부 상태가 여기에 표시됩니다.
      </div>
    );
  }

  if (snapshot.kind === "fixed_window") {
    const remaining = Math.max(0, snapshot.windowEnd - now);
    const pct = (snapshot.count / snapshot.limit) * 100;
    return (
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          State · Fixed Window
        </p>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-foreground">
            현재 창 사용량 · {snapshot.count} / {snapshot.limit}
          </p>
          <p className="font-mono text-xs text-muted">
            창 리셋까지 {(remaining / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="h-3 rounded-full bg-background/60 overflow-hidden">
          <div
            className={`h-full transition-all ${
              pct >= 100 ? "bg-rose-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
    );
  }

  if (snapshot.kind === "sliding_window") {
    return (
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          State · Sliding Window Log
        </p>
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-foreground">
            지난 {snapshot.windowMs / 1000}초 안 요청 ·{" "}
            {snapshot.requests.length} / {snapshot.limit}
          </p>
          <p className="font-mono text-xs text-muted">
            가장 오래된 요청 사라지기까지{" "}
            {snapshot.requests.length > 0
              ? `${Math.max(
                  0,
                  (snapshot.requests[0] + snapshot.windowMs - now) / 1000,
                ).toFixed(1)}s`
              : "—"}
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {Array.from({ length: snapshot.limit }).map((_, i) => (
            <li
              key={i}
              className={`h-2 flex-1 min-w-[10px] rounded-full ${
                i < snapshot.requests.length
                  ? "bg-emerald-400/70"
                  : "bg-border"
              }`}
            />
          ))}
        </ul>
      </div>
    );
  }

  const filled = Math.max(0, snapshot.tokens);
  const empty = snapshot.capacity - Math.ceil(filled);
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        State · Token Bucket
      </p>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-foreground">
          토큰 · {snapshot.tokens.toFixed(2)} / {snapshot.capacity}
        </p>
        <p className="font-mono text-xs text-muted">
          채움 속도 {snapshot.refillPerSec}/s
        </p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {Array.from({ length: snapshot.capacity }).map((_, i) => {
          const idx = snapshot.capacity - 1 - i;
          const filledAt = idx < filled;
          return (
            <li
              key={i}
              className={`h-6 w-6 rounded-full border ${
                filledAt
                  ? "border-emerald-500/40 bg-emerald-500/20"
                  : "border-border/60"
              }`}
            />
          );
        })}
      </ul>
      <p className="text-xs text-muted">
        {empty > 0
          ? `${empty}개 채워지려면 ${empty}초 필요`
          : "가득 참"}
      </p>
    </div>
  );
}
