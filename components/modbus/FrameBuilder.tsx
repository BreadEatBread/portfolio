"use client";

import { useMemo } from "react";
import { buildRequest, bytesToHexString } from "@/lib/modbus/frame";
import { functionCatalog } from "@/lib/modbus/functions";
import type { BuildRequest, ModbusFunctionCode } from "@/lib/modbus/types";
import { ByteView } from "./ByteView";
import { CopyButton } from "./CopyButton";

export type BuilderState = BuildRequest & { valuesInput: string };

type Props = {
  state: BuilderState;
  onChange: (s: BuilderState) => void;
};

function parseValues(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((tok) => {
      const n = tok.startsWith("0x") || /[a-fA-F]/.test(tok)
        ? parseInt(tok.replace(/^0x/i, ""), 16)
        : parseInt(tok, 10);
      return Number.isFinite(n) ? n & 0xffff : 0;
    });
}

const supportedFunctions = functionCatalog.filter((f) => f.supported);

export function FrameBuilder({ state, onChange }: Props) {
  const values = useMemo(() => parseValues(state.valuesInput), [state.valuesInput]);

  const bytes = useMemo(() => {
    return buildRequest({
      slaveId: clampByte(state.slaveId),
      functionCode: state.functionCode,
      address: clampU16(state.address),
      count: clampU16(state.count ?? 1),
      value: clampU16(state.value ?? 0),
      values,
    });
  }, [state, values]);

  const hex = bytesToHexString(bytes);

  const fcMeta = functionCatalog.find((f) => f.code === state.functionCode);
  const needsCount = state.functionCode === 0x03;
  const needsValue = state.functionCode === 0x06;
  const needsValues = state.functionCode === 0x10;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Field label="Slave ID" hint="1 – 247">
          <input
            type="number"
            min={0}
            max={255}
            value={state.slaveId}
            onChange={(e) =>
              onChange({ ...state, slaveId: Number(e.target.value) || 0 })
            }
            className={inputCls}
          />
        </Field>

        <Field label="Function code" hint={fcMeta?.koreanName ?? ""}>
          <select
            value={state.functionCode}
            onChange={(e) =>
              onChange({
                ...state,
                functionCode: Number(e.target.value) as ModbusFunctionCode,
              })
            }
            className={inputCls}
          >
            {supportedFunctions.map((f) => (
              <option key={f.code} value={f.code}>
                0x{f.code.toString(16).padStart(2, "0").toUpperCase()} ·{" "}
                {f.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Address" hint="0x0000 – 0xFFFF">
          <input
            type="number"
            min={0}
            max={0xffff}
            value={state.address}
            onChange={(e) =>
              onChange({ ...state, address: Number(e.target.value) || 0 })
            }
            className={inputCls}
          />
        </Field>

        {needsCount && (
          <Field label="Register count" hint="1 – 125">
            <input
              type="number"
              min={1}
              max={125}
              value={state.count ?? 1}
              onChange={(e) =>
                onChange({ ...state, count: Number(e.target.value) || 1 })
              }
              className={inputCls}
            />
          </Field>
        )}
        {needsValue && (
          <Field label="Value" hint="0x0000 – 0xFFFF">
            <input
              type="number"
              min={0}
              max={0xffff}
              value={state.value ?? 0}
              onChange={(e) =>
                onChange({ ...state, value: Number(e.target.value) || 0 })
              }
              className={inputCls}
            />
          </Field>
        )}
        {needsValues && (
          <Field
            label="Values"
            hint="공백/콤마 구분 · 10진 또는 0xHEX (예: 100 200 0x00FF)"
          >
            <input
              type="text"
              value={state.valuesInput}
              onChange={(e) =>
                onChange({ ...state, valuesInput: e.target.value })
              }
              className={inputCls + " font-mono"}
              spellCheck={false}
            />
          </Field>
        )}
      </div>

      <ByteView bytes={bytes} />

      <div className="rounded border border-border/60 bg-background/40 p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            Hex string
          </p>
          <p className="font-mono text-sm text-foreground break-all">
            {hex}
          </p>
        </div>
        <CopyButton value={hex} />
      </div>

      {fcMeta && (
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-mono text-foreground">{fcMeta.name}</span> —{" "}
          {fcMeta.description}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "h-9 rounded border border-border/60 bg-background/60 px-3 text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors";

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.floor(n)));
}
function clampU16(n: number) {
  return Math.max(0, Math.min(0xffff, Math.floor(n)));
}
