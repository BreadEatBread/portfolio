"use client";

import type { BuilderState } from "./FrameBuilder";

export type Preset = {
  label: string;
  description: string;
  state: BuilderState;
};

const presets: Preset[] = [
  {
    label: "홀딩 레지스터 2개 읽기",
    description: "Slave 1에서 주소 0x0000부터 2개",
    state: {
      slaveId: 1,
      functionCode: 0x03,
      address: 0x0000,
      count: 2,
      valuesInput: "",
    },
  },
  {
    label: "PZEM 전력계 읽기",
    description: "Slave 1, 0x0000 부터 10개 (Voltage/Current/Power…)",
    state: {
      slaveId: 1,
      functionCode: 0x03,
      address: 0x0000,
      count: 10,
      valuesInput: "",
    },
  },
  {
    label: "단일 레지스터 쓰기",
    description: "Slave 3, 주소 0x0010 에 100 쓰기",
    state: {
      slaveId: 3,
      functionCode: 0x06,
      address: 0x0010,
      value: 100,
      valuesInput: "",
    },
  },
  {
    label: "다중 레지스터 쓰기",
    description: "Slave 5, 0x0020 부터 세 값 (0x00FF, 100, 0)",
    state: {
      slaveId: 5,
      functionCode: 0x10,
      address: 0x0020,
      valuesInput: "0x00FF 100 0",
    },
  },
];

type Props = {
  onSelect: (s: BuilderState) => void;
  active?: BuilderState;
};

function isSameState(a: BuilderState, b: BuilderState) {
  return (
    a.slaveId === b.slaveId &&
    a.functionCode === b.functionCode &&
    a.address === b.address &&
    a.count === b.count &&
    a.value === b.value &&
    a.valuesInput === b.valuesInput
  );
}

export function PresetLibrary({ onSelect, active }: Props) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
      {presets.map((p) => {
        const isActive = active ? isSameState(active, p.state) : false;
        return (
          <button
            key={p.label}
            onClick={() => onSelect(p.state)}
            className={`text-left rounded border p-3 transition-colors ${
              isActive
                ? "border-foreground/40 bg-background"
                : "border-border/60 hover:border-foreground/30 hover:bg-background/60"
            }`}
          >
            <p className="text-sm font-medium text-foreground">{p.label}</p>
            <p className="mt-1 text-[11px] text-muted">{p.description}</p>
            <p className="mt-2 font-mono text-[10px] text-muted uppercase tracking-widest">
              FC 0x{p.state.functionCode.toString(16).padStart(2, "0")} · Slave{" "}
              {p.state.slaveId}
            </p>
          </button>
        );
      })}
    </div>
  );
}
