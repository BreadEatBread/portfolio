"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DeviceView } from "@/lib/dashboard/types";

type Props = {
  devices: DeviceView[];
};

type MergedPoint = {
  ts: number;
  total: number;
  time: string;
};

function buildSeries(devices: DeviceView[]): MergedPoint[] {
  const map = new Map<number, MergedPoint>();
  for (const d of devices) {
    for (const p of d.history) {
      const existing = map.get(p.ts) ?? {
        ts: p.ts,
        total: 0,
        time: new Date(p.ts).toLocaleTimeString("ko-KR", {
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      existing.total += p.power / 1000;
      map.set(p.ts, existing);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.ts - b.ts);
}

export function PowerChart({ devices }: Props) {
  const data = buildSeries(devices);

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Live · Total Power
          </p>
          <h3 className="text-sm font-medium text-foreground">
            총 소비전력 (60초)
          </h3>
        </div>
        <p className="font-mono text-xs text-muted">kW</p>
      </div>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f4f4f5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f4f4f5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              interval="preserveEnd"
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "monospace",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#ededed" }}
              formatter={(v) => [
                `${(typeof v === "number" ? v : Number(v)).toFixed(2)} kW`,
                "Total",
              ]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#ededed"
              strokeWidth={1.5}
              fill="url(#powerFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
