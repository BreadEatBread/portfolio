"use client";

import { useState } from "react";

type Item = { id: number; name: string; base: string; ts: number };

const seed: Item[] = [
  { id: 1, name: "품목 A", base: "품목 A", ts: 0 },
  { id: 2, name: "품목 B", base: "품목 B", ts: 0 },
  { id: 3, name: "품목 C", base: "품목 C", ts: 0 },
];

function fmtTs(ts: number) {
  if (ts === 0) return "—";
  return new Date(ts).toLocaleTimeString("ko-KR", { hour12: false });
}

type LogEntry = { ts: number; scope: "http" | "bus" | "sub"; text: string };

export function EventBusDemo() {
  const [server, setServer] = useState<Item[]>(seed);
  const [snapshots, setSnapshots] = useState<Record<string, Item[]>>({
    A: seed,
    B: seed,
    C: seed,
  });
  const [busOn, setBusOn] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [version, setVersion] = useState(1);
  const [targetIdx, setTargetIdx] = useState(0);

  const nextTarget = server[targetIdx];

  function pushLog(scope: LogEntry["scope"], text: string) {
    setLog((prev) => [
      { ts: Date.now(), scope, text },
      ...prev.slice(0, 11),
    ]);
  }

  function mutate(tabId: "A" | "B" | "C") {
    const target = server[targetIdx];
    const next: Item[] = server.map((it) =>
      it.id === target.id
        ? { ...it, name: `${it.base} (v${version + 1})`, ts: Date.now() }
        : it,
    );
    setServer(next);
    setVersion((v) => v + 1);
    setTargetIdx((i) => (i + 1) % server.length);

    pushLog("http", `Tab ${tabId} → PUT /api/items/${target.id} · ${target.base} 변경`);

    setSnapshots((prev) => ({ ...prev, [tabId]: next }));

    if (busOn) {
      pushLog("bus", "publish · resource:item:updated");
      const others = (["A", "B", "C"] as const).filter((t) => t !== tabId);
      window.setTimeout(() => {
        setSnapshots((prev) => {
          const updated = { ...prev };
          for (const o of others) updated[o] = next;
          return updated;
        });
        for (const o of others) {
          pushLog("sub", `Tab ${o} · reload() · 최신 스냅샷 반영`);
        }
      }, 250);
    }
  }

  function reset() {
    setServer(seed);
    setSnapshots({ A: seed, B: seed, C: seed });
    setVersion(1);
    setTargetIdx(0);
    setLog([]);
  }

  return (
    <div className="my-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            이벤트 버스
          </span>
          <button
            type="button"
            onClick={() => setBusOn((v) => !v)}
            aria-pressed={busOn}
            className={`inline-flex items-center rounded-full border transition-colors h-8 px-3 font-mono text-[11px] ${
              busOn
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-300"
            }`}
          >
            <span
              className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${
                busOn ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            {busOn ? "ON" : "OFF"}
          </button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 h-8 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <span aria-hidden>↻</span> 초기화
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(["A", "B", "C"] as const).map((tabId) => (
          <TabView
            key={tabId}
            label={`Tab ${tabId}`}
            items={snapshots[tabId]}
            stale={JSON.stringify(snapshots[tabId]) !== JSON.stringify(server)}
            nextLabel={`${nextTarget.base} 수정`}
            onMutate={() => mutate(tabId)}
          />
        ))}
      </div>

      <LogPane log={log} />

      <p className="text-xs text-muted leading-relaxed">
        <span className="text-foreground">읽는 법</span> —{" "}
        <span className="text-amber-300">STALE</span> 뱃지는 그 탭의 스냅샷이
        서버 최신본과 다르다는 뜻. 버튼은 눌릴 때마다 다른 품목(A → B → C → A ...)
        을 수정합니다. 이벤트 버스를 끈 상태에서 아무 탭이나 눌러 보세요. 옆
        탭들이 이전 스냅샷을 계속 들고 있습니다. 다시 켜면 다음 수정부터 자동으로
        최신 스냅샷을 받아옵니다.
      </p>
    </div>
  );
}

function TabView({
  label,
  items,
  stale,
  nextLabel,
  onMutate,
}: {
  label: string;
  items: Item[];
  stale: boolean;
  nextLabel: string;
  onMutate: () => void;
}) {
  return (
    <div
      className={`rounded-lg border transition-colors ${
        stale ? "border-amber-500/40" : "border-border"
      } bg-card`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="font-mono text-xs text-foreground">{label}</p>
        {stale ? (
          <span className="font-mono text-[10px] rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-300">
            STALE
          </span>
        ) : (
          <span className="font-mono text-[10px] rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
            FRESH
          </span>
        )}
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((it) => (
          <li
            key={it.id}
            className="px-3 py-2 flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-foreground truncate">{it.name}</span>
            <span className="font-mono text-[10px] text-muted shrink-0 tabular-nums">
              {fmtTs(it.ts)}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={onMutate}
          className="w-full h-8 rounded border border-border/60 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function LogPane({ log }: { log: LogEntry[] }) {
  const scopeStyle: Record<LogEntry["scope"], string> = {
    http: "text-sky-300",
    bus: "text-emerald-300",
    sub: "text-violet-300",
  };
  return (
    <div className="rounded border border-border/60 bg-background/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
        Event log
      </p>
      <ul className="space-y-1 max-h-40 overflow-y-auto">
        {log.length === 0 && (
          <li className="text-xs text-muted font-mono py-2 text-center">
            상단 Tab 에서 버튼을 눌러보세요.
          </li>
        )}
        {log.map((e, i) => (
          <li
            key={i}
            className="flex items-baseline gap-2 font-mono text-[11px]"
          >
            <span className="text-muted tabular-nums">
              {new Date(e.ts).toLocaleTimeString("ko-KR", { hour12: false })}
            </span>
            <span
              className={`uppercase tracking-widest text-[10px] ${scopeStyle[e.scope]}`}
            >
              {e.scope}
            </span>
            <span className="text-foreground/80">{e.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
