"use client";

import { devices as deviceList } from "@/lib/dashboard/devices";
import type { DeviceState, DeviceView } from "@/lib/dashboard/types";

type Props = {
  devices: DeviceView[];
  paused: boolean;
  onPauseToggle: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  onForceState: (id: string, s: DeviceState) => void;
  onReset: () => void;
};

const SPEEDS = [0.5, 1, 2, 4];

const stateOptions: { value: DeviceState; label: string; className: string }[] =
  [
    { value: "running", label: "가동", className: "text-emerald-400" },
    { value: "idle", label: "대기", className: "text-zinc-400" },
    { value: "warning", label: "경고", className: "text-amber-400" },
    { value: "error", label: "오류", className: "text-red-400" },
  ];

export function ControlPanel({
  devices,
  paused,
  onPauseToggle,
  speed,
  onSpeedChange,
  onForceState,
  onReset,
}: Props) {
  const findState = (id: string) =>
    devices.find((d) => d.id === id)?.state ?? "running";

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 gap-3 flex-wrap">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">
            Control · Try it
          </p>
          <h3 className="text-sm font-medium text-foreground">
            시뮬레이터 조작 <span className="text-muted font-normal">— 직접 만져보세요</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onPauseToggle}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 h-8 font-mono text-[11px] transition-colors ${
              paused
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-border text-muted hover:text-foreground hover:border-foreground/30"
            }`}
          >
            <span aria-hidden>{paused ? "▶" : "❚❚"}</span>
            {paused ? "재생" : "일시정지"}
          </button>

          <div className="inline-flex items-center rounded-full border border-border overflow-hidden">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-3 h-8 font-mono text-[11px] transition-colors ${
                  s === speed
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 h-8 font-mono text-[11px] text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <span aria-hidden>↻</span> 초기화
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
          Force device state
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {deviceList.map((d) => {
            const current = findState(d.id);
            return (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded border border-border/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-xs text-foreground truncate">{d.name}</p>
                  <p className="font-mono text-[10px] text-muted">{d.id}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {stateOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onForceState(d.id, opt.value)}
                      title={`${d.name} → ${opt.label}`}
                      className={`h-7 min-w-[36px] px-2 rounded font-mono text-[10px] border transition-colors ${
                        current === opt.value
                          ? `border-foreground/30 bg-background ${opt.className}`
                          : "border-border/60 text-muted hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
