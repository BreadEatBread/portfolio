import { devices, profiles } from "./devices";
import type {
  DashboardEvent,
  DeviceSnapshot,
  DeviceState,
  DeviceView,
  TelemetryPoint,
} from "./types";

const HISTORY_SIZE = 120;
const EVENT_LIMIT = 40;

type InternalState = {
  snapshots: Map<string, DeviceSnapshot>;
  histories: Map<string, TelemetryPoint[]>;
  events: DashboardEvent[];
  seedTick: number;
  stateOverrides: Map<string, DeviceState>;
};

function noise(range: number) {
  return (Math.random() - 0.5) * 2 * range;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function pickAlarmMessage(kind: string, state: DeviceState) {
  if (state === "warning") {
    if (kind === "cold_storage") return "고내 온도 상승 감지";
    if (kind === "milling") return "스핀들 진동 임계치 접근";
    if (kind === "filler") return "충진량 편차 증가";
    if (kind === "metal_detector") return "감도 재조정 필요";
    return "센서 응답 지연";
  }
  if (state === "error") {
    if (kind === "cold_storage") return "냉각 사이클 실패";
    if (kind === "milling") return "스핀들 과열 정지";
    if (kind === "filler") return "노즐 막힘 의심";
    if (kind === "metal_detector") return "이물질 검출 → 라인 홀드";
    return "통신 두절";
  }
  return "정상 상태 복귀";
}

export function createSimulator() {
  const state: InternalState = {
    snapshots: new Map(),
    histories: new Map(),
    events: [],
    seedTick: 0,
    stateOverrides: new Map(),
  };

  for (const d of devices) {
    const p = profiles[d.kind];
    state.snapshots.set(d.id, {
      id: d.id,
      state: "running",
      power: p.ratedPower * 0.7,
      temperature: p.hasTemperature ? p.tempBaseline : undefined,
      vibration: p.hasVibration ? 0.4 : undefined,
      uptimeSec: 3600 + Math.floor(Math.random() * 5000),
    });
    state.histories.set(d.id, []);
  }

  function tick(nowMs: number): {
    devices: DeviceView[];
    events: DashboardEvent[];
  } {
    state.seedTick += 1;

    for (const d of devices) {
      const snap = state.snapshots.get(d.id)!;
      const p = profiles[d.kind];

      const prevState = snap.state;
      let nextState: DeviceState = snap.state;

      const forced = state.stateOverrides.get(d.id);
      if (forced) {
        nextState = forced;
        state.stateOverrides.delete(d.id);
      } else {
        const roll = Math.random();
        if (snap.state === "running") {
          if (roll < 0.005) nextState = "idle";
          else if (roll < 0.008) nextState = "warning";
          else if (roll < 0.0085) nextState = "error";
        } else if (snap.state === "idle") {
          if (roll < 0.02) nextState = "running";
        } else if (snap.state === "warning") {
          if (roll < 0.05) nextState = "running";
          else if (roll < 0.06) nextState = "error";
        } else if (snap.state === "error") {
          if (roll < 0.02) nextState = "running";
        }
      }

      let powerFactor = 0.75;
      if (nextState === "idle") powerFactor = 0.08;
      else if (nextState === "warning") powerFactor = 0.9;
      else if (nextState === "error") powerFactor = 0.02;
      const power = clamp(
        p.ratedPower * powerFactor + noise(p.ratedPower * 0.05),
        0,
        p.ratedPower * 1.1,
      );

      let temperature: number | undefined;
      if (p.hasTemperature) {
        const drift =
          nextState === "warning"
            ? 4
            : nextState === "error"
              ? 8
              : nextState === "idle"
                ? -1
                : 0;
        const base = (snap.temperature ?? p.tempBaseline ?? 25) + noise(0.3) + drift * 0.05;
        temperature = clamp(base, p.tempRange![0] - 3, p.tempRange![1] + 5);
      }

      let vibration: number | undefined;
      if (p.hasVibration) {
        const base =
          nextState === "warning" ? 1.6 : nextState === "error" ? 0.05 : 0.5;
        vibration = clamp(base + noise(0.15), 0, 3);
      }

      const nextSnap: DeviceSnapshot = {
        id: d.id,
        state: nextState,
        power,
        temperature,
        vibration,
        uptimeSec: snap.uptimeSec + 0.5,
      };
      state.snapshots.set(d.id, nextSnap);

      const history = state.histories.get(d.id)!;
      history.push({ ts: nowMs, power, temperature, vibration });
      if (history.length > HISTORY_SIZE) history.shift();

      if (prevState !== nextState) {
        const message = pickAlarmMessage(d.kind, nextState);
        state.events.unshift({
          id: `${d.id}-${nowMs}-${state.seedTick}`,
          ts: nowMs,
          deviceId: d.id,
          deviceName: d.name,
          kind:
            nextState === "warning" || nextState === "error"
              ? "alarm"
              : prevState === "warning" || prevState === "error"
                ? "recovery"
                : "state_change",
          message,
        });
        if (state.events.length > EVENT_LIMIT) state.events.pop();
      }
    }

    const views: DeviceView[] = devices.map((d) => ({
      ...d,
      ...state.snapshots.get(d.id)!,
      history: state.histories.get(d.id)!.slice(),
    }));

    return { devices: views, events: state.events.slice() };
  }

  function forceState(deviceId: string, next: DeviceState) {
    if (!state.snapshots.has(deviceId)) return;
    state.stateOverrides.set(deviceId, next);
  }

  function reset() {
    state.events.length = 0;
    state.stateOverrides.clear();
    for (const d of devices) {
      const p = profiles[d.kind];
      state.snapshots.set(d.id, {
        id: d.id,
        state: "running",
        power: p.ratedPower * 0.7,
        temperature: p.hasTemperature ? p.tempBaseline : undefined,
        vibration: p.hasVibration ? 0.4 : undefined,
        uptimeSec: 3600 + Math.floor(Math.random() * 5000),
      });
      state.histories.set(d.id, []);
    }
  }

  return { tick, forceState, reset };
}

export type Simulator = ReturnType<typeof createSimulator>;
