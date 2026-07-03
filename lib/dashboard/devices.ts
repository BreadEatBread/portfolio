import type { DeviceKind, DeviceMeta } from "./types";

type DeviceProfile = {
  ratedPower: number;
  hasTemperature: boolean;
  hasVibration: boolean;
  tempBaseline?: number;
  tempRange?: [number, number];
};

export const profiles: Record<DeviceKind, DeviceProfile> = {
  cold_storage: {
    ratedPower: 3500,
    hasTemperature: true,
    hasVibration: false,
    tempBaseline: -19,
    tempRange: [-22, -12],
  },
  metal_detector: {
    ratedPower: 400,
    hasTemperature: false,
    hasVibration: true,
  },
  filler: {
    ratedPower: 1200,
    hasTemperature: false,
    hasVibration: true,
  },
  milling: {
    ratedPower: 4800,
    hasTemperature: true,
    hasVibration: true,
    tempBaseline: 42,
    tempRange: [30, 78],
  },
  line_controller: {
    ratedPower: 220,
    hasTemperature: false,
    hasVibration: false,
  },
};

export const devices: DeviceMeta[] = [
  {
    id: "CS-A",
    name: "냉동고 A",
    kind: "cold_storage",
    location: "베이커리 1층",
    ratedPower: profiles.cold_storage.ratedPower,
  },
  {
    id: "MD-01",
    name: "금속검출기 1호",
    kind: "metal_detector",
    location: "출하 라인",
    ratedPower: profiles.metal_detector.ratedPower,
  },
  {
    id: "FL-02",
    name: "충진기 2호",
    kind: "filler",
    location: "충진 라인",
    ratedPower: profiles.filler.ratedPower,
  },
  {
    id: "ML-01",
    name: "밀링머신",
    kind: "milling",
    location: "가공동",
    ratedPower: profiles.milling.ratedPower,
  },
  {
    id: "LC-00",
    name: "라인 컨트롤러",
    kind: "line_controller",
    location: "제어실",
    ratedPower: profiles.line_controller.ratedPower,
  },
];

export const kindLabel: Record<DeviceKind, string> = {
  cold_storage: "냉동고",
  metal_detector: "금속검출기",
  filler: "충진기",
  milling: "밀링머신",
  line_controller: "라인 컨트롤러",
};
