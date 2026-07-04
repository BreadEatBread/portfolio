"use client";

import { useState } from "react";
import { useDashboardStream } from "@/hooks/useDashboardStream";
import { useSimulator } from "@/hooks/useSimulator";
import { ControlPanel } from "./ControlPanel";
import { DashboardHeader } from "./DashboardHeader";
import { DeviceCard } from "./DeviceCard";
import { EventLog } from "./EventLog";
import { KpiRow } from "./KpiRow";
import { PowerChart } from "./PowerChart";
import { SourceToggle, type DataSource } from "./SourceToggle";

export function Dashboard() {
  const [source, setSource] = useState<DataSource>("server");
  const isServer = source === "server";

  const stream = useDashboardStream(isServer);
  const client = useSimulator(!isServer);

  const view = isServer
    ? {
        devices: stream.devices,
        events: stream.events,
        tickCount: stream.tickCount,
      }
    : {
        devices: client.devices,
        events: client.events,
        tickCount: client.tickCount,
      };

  const booting = view.devices.length === 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        tickCount={view.tickCount}
        paused={!isServer && client.paused}
        speed={!isServer ? client.speed : 1}
        badgeOverride={
          isServer
            ? stream.status === "connected"
              ? { label: "SSE · LIVE", tone: "emerald" }
              : stream.status === "reconnecting" || stream.status === "connecting"
                ? { label: "SSE · RECONNECT", tone: "amber" }
                : stream.status === "error"
                  ? { label: "SSE · ERROR", tone: "rose" }
                  : undefined
            : undefined
        }
      />

      <SourceToggle source={source} onChange={setSource} status={stream.status} />

      {booting ? (
        <div className="text-center text-muted text-sm py-20">
          {isServer ? "서버 스트림 연결 중…" : "Booting simulator…"}
        </div>
      ) : (
        <>
          <KpiRow devices={view.devices} events={view.events} />
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <PowerChart devices={view.devices} />
            <EventLog events={view.events} />
          </div>
          {isServer ? (
            <ControlPanel
              variant="server"
              devices={view.devices}
              onForceState={stream.forceState}
              onReset={stream.reset}
            />
          ) : (
            <ControlPanel
              variant="client"
              devices={view.devices}
              paused={client.paused}
              onPauseToggle={() => client.setPaused(!client.paused)}
              speed={client.speed}
              onSpeedChange={client.setSpeed}
              onForceState={client.forceState}
              onReset={client.reset}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {view.devices.map((d) => (
              <DeviceCard key={d.id} device={d} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
