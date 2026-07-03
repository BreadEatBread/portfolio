"use client";

import { useSimulator } from "@/hooks/useSimulator";
import { ControlPanel } from "./ControlPanel";
import { DashboardHeader } from "./DashboardHeader";
import { DeviceCard } from "./DeviceCard";
import { EventLog } from "./EventLog";
import { KpiRow } from "./KpiRow";
import { PowerChart } from "./PowerChart";

export function Dashboard() {
  const sim = useSimulator();
  const { devices, events, tickCount, paused, speed } = sim;

  if (devices.length === 0) {
    return (
      <div className="text-center text-muted text-sm py-20">
        Booting simulator...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader tickCount={tickCount} paused={paused} speed={speed} />
      <KpiRow devices={devices} events={events} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PowerChart devices={devices} />
        <EventLog events={events} />
      </div>
      <ControlPanel
        devices={devices}
        paused={paused}
        onPauseToggle={() => sim.setPaused(!paused)}
        speed={speed}
        onSpeedChange={sim.setSpeed}
        onForceState={sim.forceState}
        onReset={sim.reset}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {devices.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
