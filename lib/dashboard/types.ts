export type DeviceKind =
  | "cold_storage"
  | "metal_detector"
  | "filler"
  | "milling"
  | "line_controller";

export type DeviceState = "running" | "idle" | "warning" | "error";

export type DeviceMeta = {
  id: string;
  name: string;
  kind: DeviceKind;
  location: string;
  ratedPower: number;
};

export type DeviceSnapshot = {
  id: string;
  state: DeviceState;
  power: number;
  temperature?: number;
  vibration?: number;
  uptimeSec: number;
};

export type TelemetryPoint = {
  ts: number;
  power: number;
  temperature?: number;
  vibration?: number;
};

export type DeviceView = DeviceMeta & DeviceSnapshot & {
  history: TelemetryPoint[];
};

export type EventKind = "state_change" | "alarm" | "recovery";

export type DashboardEvent = {
  id: string;
  ts: number;
  deviceId: string;
  deviceName: string;
  kind: EventKind;
  message: string;
};
