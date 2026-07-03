import type { DeviceState } from "@/lib/dashboard/types";

const styles: Record<
  DeviceState,
  { label: string; text: string; bg: string; dot: string }
> = {
  running: {
    label: "가동",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  idle: {
    label: "대기",
    text: "text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
    dot: "bg-zinc-400",
  },
  warning: {
    label: "경고",
    text: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
  },
  error: {
    label: "오류",
    text: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    dot: "bg-red-400",
  },
};

export function StateBadge({
  state,
  size = "sm",
}: {
  state: DeviceState;
  size?: "sm" | "md";
}) {
  const s = styles[state];
  const pad = size === "md" ? "px-2.5 py-1" : "px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono text-[11px] ${pad} ${s.bg} ${s.text}`}
    >
      <span className={`relative flex h-1.5 w-1.5`}>
        {(state === "running" || state === "warning" || state === "error") && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${s.dot}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}
