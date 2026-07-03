import { kindLabel } from "@/lib/dashboard/devices";
import type { DeviceView } from "@/lib/dashboard/types";
import { Sparkline } from "./Sparkline";
import { StateBadge } from "./StateBadge";

type Props = { device: DeviceView };

function formatUptime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function DeviceCard({ device }: Props) {
  const powerHistory = device.history.map((h) => h.power / 1000);
  const primary =
    device.kind === "cold_storage" || device.kind === "milling"
      ? {
          label: "온도",
          value: device.temperature?.toFixed(1) ?? "—",
          unit: "°C",
        }
      : device.kind === "filler" || device.kind === "metal_detector"
        ? {
            label: "진동",
            value: device.vibration?.toFixed(2) ?? "—",
            unit: "g",
          }
        : {
            label: "가동시간",
            value: formatUptime(device.uptimeSec),
            unit: "",
          };

  const sparkColor =
    device.state === "warning"
      ? "text-amber-400"
      : device.state === "error"
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {kindLabel[device.kind]} · {device.id}
          </p>
          <h4 className="mt-1 text-sm font-medium text-foreground truncate">
            {device.name}
          </h4>
          <p className="text-xs text-muted truncate">{device.location}</p>
        </div>
        <StateBadge state={device.state} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-1">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            전력
          </p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
            {(device.power / 1000).toFixed(2)}
            <span className="text-xs text-muted font-normal ml-1">kW</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {primary.label}
          </p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
            {primary.value}
            {primary.unit && (
              <span className="text-xs text-muted font-normal ml-1">
                {primary.unit}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className={`mt-1 ${sparkColor}`}>
        <Sparkline data={powerHistory} width={280} height={40} />
      </div>
    </div>
  );
}
