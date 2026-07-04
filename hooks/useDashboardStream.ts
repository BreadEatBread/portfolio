"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DashboardEvent,
  DeviceState,
  DeviceView,
} from "@/lib/dashboard/types";

export type StreamStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

export type DashboardStreamSnapshot = {
  devices: DeviceView[];
  events: DashboardEvent[];
  tickCount: number;
  status: StreamStatus;
  lastMessageAt: number | null;
  sessionId: string | null;
};

export type DashboardStreamControls = {
  forceState: (deviceId: string, state: DeviceState) => Promise<void>;
  reset: () => Promise<void>;
};

const initial: DashboardStreamSnapshot = {
  devices: [],
  events: [],
  tickCount: 0,
  status: "idle",
  lastMessageAt: null,
  sessionId: null,
};

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useDashboardStream(
  enabled: boolean,
): DashboardStreamSnapshot & DashboardStreamControls {
  const [snapshot, setSnapshot] = useState<DashboardStreamSnapshot>(initial);
  const sessionRef = useRef<string | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setSnapshot(initial);
      tickRef.current = 0;
      return;
    }

    if (!sessionRef.current) sessionRef.current = generateSessionId();
    const sessionId = sessionRef.current;

    setSnapshot((s) => ({ ...s, status: "connecting", sessionId }));

    const es = new EventSource(
      `/api/dashboard/stream?session=${encodeURIComponent(sessionId)}`,
    );

    es.onopen = () => {
      setSnapshot((s) => ({ ...s, status: "connected", sessionId }));
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
          sessionId,
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
      // EventSource retries automatically
    };

    return () => {
      es.close();
    };
  }, [enabled]);

  const post = useCallback(async (body: unknown) => {
    if (!sessionRef.current) return;
    try {
      await fetch("/api/dashboard/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // swallow — client would already see the connection status
    }
  }, []);

  const forceState = useCallback(
    (deviceId: string, state: DeviceState) =>
      post({
        action: "force-state",
        session: sessionRef.current,
        deviceId,
        state,
      }),
    [post],
  );

  const reset = useCallback(
    () => post({ action: "reset", session: sessionRef.current }),
    [post],
  );

  return useMemo(
    () => ({ ...snapshot, forceState, reset }),
    [snapshot, forceState, reset],
  );
}
