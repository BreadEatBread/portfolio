"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSimulator } from "@/lib/dashboard/simulator";
import type {
  DashboardEvent,
  DeviceState,
  DeviceView,
} from "@/lib/dashboard/types";

export type SimulatorSnapshot = {
  devices: DeviceView[];
  events: DashboardEvent[];
  tickCount: number;
};

export type SimulatorControls = {
  paused: boolean;
  setPaused: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  forceState: (deviceId: string, state: DeviceState) => void;
  reset: () => void;
};

const initial: SimulatorSnapshot = {
  devices: [],
  events: [],
  tickCount: 0,
};

const BASE_INTERVAL_MS = 500;

export function useSimulator(): SimulatorSnapshot & SimulatorControls {
  const [snapshot, setSnapshot] = useState<SimulatorSnapshot>(initial);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  const simRef = useRef<ReturnType<typeof createSimulator> | null>(null);
  const tickCountRef = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (!simRef.current) simRef.current = createSimulator();

    const emit = () => {
      if (pausedRef.current) return;
      const now = Date.now();
      const { devices, events } = simRef.current!.tick(now);
      tickCountRef.current += 1;
      setSnapshot({ devices, events, tickCount: tickCountRef.current });
    };

    emit();
    const id = window.setInterval(emit, BASE_INTERVAL_MS / speed);
    return () => window.clearInterval(id);
  }, [speed]);

  const forceState = useCallback((deviceId: string, next: DeviceState) => {
    simRef.current?.forceState(deviceId, next);
  }, []);

  const reset = useCallback(() => {
    simRef.current?.reset();
    tickCountRef.current = 0;
    setSnapshot({ devices: [], events: [], tickCount: 0 });
  }, []);

  const controls = useMemo<SimulatorControls>(
    () => ({ paused, setPaused, speed, setSpeed, forceState, reset }),
    [paused, speed, forceState, reset],
  );

  return { ...snapshot, ...controls };
}
