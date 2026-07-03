import type { DashboardEvent, DeviceView } from "@/lib/dashboard/types";

type Props = {
  devices: DeviceView[];
  events: DashboardEvent[];
};

function formatKw(w: number) {
  return (w / 1000).toFixed(2);
}

export function KpiRow({ devices, events }: Props) {
  const running = devices.filter((d) => d.state === "running").length;
  const totalPower = devices.reduce((s, d) => s + d.power, 0);
  const activeAlarms = devices.filter(
    (d) => d.state === "warning" || d.state === "error",
  ).length;
  const alarms24h = events.filter((e) => e.kind === "alarm").length;

  const kpis = [
    {
      label: "가동 중",
      value: `${running}/${devices.length}`,
      hint: "대수 (Running / Total)",
    },
    {
      label: "총 소비전력",
      value: `${formatKw(totalPower)} kW`,
      hint: "Real-time aggregate",
    },
    {
      label: "활성 알람",
      value: `${activeAlarms}`,
      hint: activeAlarms > 0 ? "즉시 확인 필요" : "정상",
      accent: activeAlarms > 0,
    },
    {
      label: "누적 알람 이벤트",
      value: `${alarms24h}`,
      hint: "세션 중 발생",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {kpis.map((k) => (
        <div
          key={k.label}
          className={`rounded-lg border border-border p-4 bg-card ${
            k.accent ? "ring-1 ring-amber-500/30" : ""
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
            {k.label}
          </p>
          <p
            className={`text-2xl font-semibold tracking-tight tabular-nums ${
              k.accent ? "text-amber-400" : "text-foreground"
            }`}
          >
            {k.value}
          </p>
          <p className="mt-1 text-xs text-muted">{k.hint}</p>
        </div>
      ))}
    </div>
  );
}
