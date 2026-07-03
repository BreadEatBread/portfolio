"use client";

import { useMemo, useState } from "react";
import { parseHexString, parseRequestFrame } from "@/lib/modbus/frame";
import { ByteView } from "./ByteView";

export function FrameDecoder() {
  const [input, setInput] = useState("01 03 00 00 00 02 C4 0B");

  const { parsed, error } = useMemo(() => {
    try {
      const bytes = parseHexString(input);
      if (bytes.length === 0) return { parsed: null, error: null };
      return { parsed: parseRequestFrame(bytes), error: null };
    } catch (e) {
      return {
        parsed: null,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <div>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Hex 입력
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={2}
            className="rounded border border-border/60 bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            placeholder="예: 01 03 00 00 00 02 C4 0B"
          />
          <span className="text-[11px] text-muted">
            공백·콤마·세미콜론·파이프 구분 · 0x 접두사 허용 · 붙어있는 hex 문자열도 OK
          </span>
        </label>
      </div>

      {error && (
        <div className="rounded border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 font-mono">
          {error}
        </div>
      )}

      {parsed && (
        <>
          <ByteView bytes={parsed.bytes} />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Meta label="Slave ID" value={parsed.slaveId.toString()} />
            <Meta
              label="Function"
              value={`0x${parsed.functionCode
                .toString(16)
                .padStart(2, "0")
                .toUpperCase()} · ${parsed.functionName}`}
            />
            {parsed.address !== undefined && (
              <Meta
                label="Address"
                value={`0x${parsed.address
                  .toString(16)
                  .padStart(4, "0")
                  .toUpperCase()} (${parsed.address})`}
              />
            )}
            {parsed.count !== undefined && (
              <Meta label="Count" value={parsed.count.toString()} />
            )}
            {parsed.value !== undefined && (
              <Meta
                label="Value"
                value={`0x${parsed.value
                  .toString(16)
                  .padStart(4, "0")
                  .toUpperCase()} (${parsed.value})`}
              />
            )}
            {parsed.data && parsed.data.length > 0 && (
              <Meta
                label="Data"
                value={parsed.data
                  .map(
                    (v) =>
                      "0x" +
                      v.toString(16).padStart(4, "0").toUpperCase(),
                  )
                  .join(" ")}
              />
            )}
            <Meta
              label="CRC (수신)"
              value={
                "0x" +
                parsed.crc.toString(16).padStart(4, "0").toUpperCase()
              }
            />
            <Meta
              label="CRC (계산)"
              value={
                "0x" +
                parsed.computedCrc
                  .toString(16)
                  .padStart(4, "0")
                  .toUpperCase()
              }
              accent={parsed.crcOk ? "ok" : "err"}
            />
          </div>

          {parsed.errors.length > 0 && (
            <ul className="space-y-2">
              {parsed.errors.map((e, i) => (
                <li
                  key={i}
                  className="rounded border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
                >
                  {e}
                </li>
              ))}
            </ul>
          )}

          {parsed.errors.length === 0 && parsed.crcOk && (
            <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              프레임 유효 · CRC 일치 ✓
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Meta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "ok" | "err";
}) {
  const valueColor =
    accent === "ok"
      ? "text-emerald-300"
      : accent === "err"
        ? "text-rose-300"
        : "text-foreground";
  return (
    <div className="rounded border border-border/60 bg-background/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
        {label}
      </p>
      <p className={`font-mono text-sm ${valueColor} break-all`}>{value}</p>
    </div>
  );
}
