"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DashboardEvent,
  DeviceView,
} from "@/lib/dashboard/types";

export type StreamStatus = "idle" | "connecting" | "connected" | "reconnecting" | "error";

export type DashboardStreamSnapshot = {
  devices: DeviceView[];
  events: DashboardEvent[];
  tickCount: number;
  status: StreamStatus;
  lastMessageAt: number | null;
};

const initial: DashboardStreamSnapshot = {
  devices: [],
  events: [],
  tickCount: 0,
  status: "idle",
  lastMessageAt: null,
};

export function useDashboardStream(enabled: boolean): DashboardStreamSnapshot {
  const [snapshot, setSnapshot] = useState<DashboardStreamSnapshot>(initial);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setSnapshot(initial);
      tickRef.current = 0;
      return;
    }

    setSnapshot((s) => ({ ...s, status: "connecting" }));

    const es = new EventSource("/api/dashboard/stream");

    es.onopen = () => {
      setSnapshot((s) => ({ ...s, status: "connected" }));
    };

    es.addEventListener("tick", (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as {
          devices: DeviceView[];
          events: DashboardEvent[];
          ts: number;
        };
        tickRef.current += 1;
        setSnapshot({
          devices: data.devices,
          events: data.events,
          tickCount: tickRef.current,
          status: "connected",
          lastMessageAt: data.ts,
        });
      } catch {
        // ignore malformed frame
      }
    });

    es.onerror = () => {
      setSnapshot((s) => ({
        ...s,
        status: s.status === "connected" ? "reconnecting" : "error",
      }));
      // EventSource will retry automatically
    };

    return () => {
      es.close();
    };
  }, [enabled]);

  return snapshot;
}
