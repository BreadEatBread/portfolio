import type { DashboardEvent } from "@/lib/dashboard/types";

type Props = { events: DashboardEvent[] };

const kindStyle: Record<
  DashboardEvent["kind"],
  { label: string; color: string; bar: string }
> = {
  alarm: {
    label: "ALARM",
    color: "text-amber-400",
    bar: "bg-amber-400",
  },
  recovery: {
    label: "OK",
    color: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  state_change: {
    label: "INFO",
    color: "text-zinc-400",
    bar: "bg-zinc-500",
  },
};

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("ko-KR", { hour12: false });
}

export function EventLog({ events }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">
            Event Log
          </p>
          <h3 className="text-sm font-medium text-foreground">
            최근 이벤트
          </h3>
        </div>
        <p className="font-mono text-[10px] text-muted">
          {events.length} events
        </p>
      </div>
      <ul
        aria-live="polite"
        aria-label="최근 이벤트 스트림"
        className="divide-y divide-border max-h-[420px] overflow-y-auto"
      >
        {events.length === 0 && (
          <li className="px-4 py-6 text-center text-xs text-muted">
            이벤트가 아직 없습니다.
          </li>
        )}
        {events.slice(0, 30).map((e) => {
          const s = kindStyle[e.kind];
          return (
            <li key={e.id} className="flex gap-3 px-4 py-3 items-start">
              <span className={`mt-2 h-1.5 w-1.5 rounded-full ${s.bar}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-[10px] ${s.color}`}>
                    {s.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted tabular-nums">
                    {fmtTime(e.ts)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground truncate">
                  {e.deviceName}
                </p>
                <p className="text-xs text-muted truncate">{e.message}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
