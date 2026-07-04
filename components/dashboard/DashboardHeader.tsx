"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BadgeTone = "emerald" | "amber" | "rose";

type Props = {
  tickCount: number;
  paused: boolean;
  speed: number;
  badgeOverride?: { label: string; tone: BadgeTone };
};

const toneStyle: Record<
  BadgeTone,
  { color: string; border: string; bg: string; dotBg: string; animate: boolean }
> = {
  emerald: {
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    dotBg: "bg-emerald-400",
    animate: true,
  },
  amber: {
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    dotBg: "bg-amber-400",
    animate: true,
  },
  rose: {
    color: "text-rose-400",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    dotBg: "bg-rose-400",
    animate: true,
  },
};

export function DashboardHeader({
  tickCount,
  paused,
  speed,
  badgeOverride,
}: Props) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setNow(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const badge = badgeOverride
    ? { ...toneStyle[badgeOverride.tone], label: badgeOverride.label }
    : paused
      ? { ...toneStyle.amber, label: "PAUSED", animate: false }
      : {
          ...toneStyle.emerald,
          label: speed === 1 ? "LIVE" : `LIVE · ${speed}x`,
        };

  return (
    <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
      <div>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
        >
          <span aria-hidden>←</span> 포트폴리오로
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Case study · IoT Realtime
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Factory Live
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl">
          공장 설비 5대의 상태·전력·온도·진동을 실시간으로 스트리밍하는 데모.
          아래 토글로 서버 SSE 와 브라우저 시뮬레이터를 왔다갔다 해볼 수 있습니다.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div
          className={`flex items-center gap-2 rounded-full border ${badge.border} ${badge.bg} px-3 py-1.5`}
        >
          <span className="relative flex h-2 w-2">
            {badge.animate && (
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${badge.dotBg}`}
              />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${badge.dotBg}`}
            />
          </span>
          <span className={`font-mono text-[11px] ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="text-right font-mono text-[11px] text-muted">
          <p className="tabular-nums">{now}</p>
          <p>tick #{tickCount.toString().padStart(4, "0")}</p>
        </div>
      </div>
    </div>
  );
}
