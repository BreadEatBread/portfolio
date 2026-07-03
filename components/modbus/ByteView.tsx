import type { ByteRole, LabeledByte } from "@/lib/modbus/types";

const roleStyles: Record<
  ByteRole,
  { badge: string; text: string; ring: string; label: string }
> = {
  slave: {
    badge: "bg-sky-500/10 border-sky-500/30",
    text: "text-sky-300",
    ring: "ring-sky-500/40",
    label: "Slave",
  },
  function: {
    badge: "bg-emerald-500/10 border-emerald-500/30",
    text: "text-emerald-300",
    ring: "ring-emerald-500/40",
    label: "Function",
  },
  address: {
    badge: "bg-violet-500/10 border-violet-500/30",
    text: "text-violet-300",
    ring: "ring-violet-500/40",
    label: "Address",
  },
  count: {
    badge: "bg-cyan-500/10 border-cyan-500/30",
    text: "text-cyan-300",
    ring: "ring-cyan-500/40",
    label: "Count",
  },
  byteCount: {
    badge: "bg-cyan-500/10 border-cyan-500/30",
    text: "text-cyan-300",
    ring: "ring-cyan-500/40",
    label: "Byte count",
  },
  value: {
    badge: "bg-amber-500/10 border-amber-500/30",
    text: "text-amber-300",
    ring: "ring-amber-500/40",
    label: "Value",
  },
  data: {
    badge: "bg-zinc-500/10 border-zinc-500/30",
    text: "text-zinc-300",
    ring: "ring-zinc-500/40",
    label: "Data",
  },
  crc: {
    badge: "bg-rose-500/10 border-rose-500/30",
    text: "text-rose-300",
    ring: "ring-rose-500/40",
    label: "CRC",
  },
};

function hex(b: number) {
  return b.toString(16).padStart(2, "0").toUpperCase();
}

export function ByteView({ bytes }: { bytes: LabeledByte[] }) {
  if (bytes.length === 0) {
    return (
      <div className="rounded border border-border/60 bg-background/40 p-6 text-center text-xs text-muted font-mono">
        데이터 없음
      </div>
    );
  }

  const roles = Array.from(new Set(bytes.map((b) => b.role)));

  return (
    <div className="space-y-4">
      <div className="rounded border border-border/60 bg-background/40 p-4 overflow-x-auto">
        <div className="flex flex-wrap gap-1.5 min-w-fit">
          {bytes.map((b, i) => {
            const s = roleStyles[b.role];
            return (
              <div
                key={i}
                title={`${b.label} · 0x${hex(b.value)} · ${b.value}`}
                className={`group relative flex flex-col items-center rounded border ${s.badge} px-2 py-1.5 min-w-[42px]`}
              >
                <span className={`font-mono text-sm ${s.text}`}>
                  {hex(b.value)}
                </span>
                <span className="font-mono text-[9px] text-muted mt-0.5">
                  {String(i).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const s = roleStyles[r];
          return (
            <span
              key={r}
              className={`inline-flex items-center gap-1.5 rounded-full border ${s.badge} px-2.5 py-1 font-mono text-[10px] ${s.text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${s.text.replace("text-", "bg-")}`}
              />
              {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
