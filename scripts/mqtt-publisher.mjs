#!/usr/bin/env node
/**
 * Factory Live — MQTT Publisher
 *
 * 브라우저 시뮬레이터와 동일한 5대 설비의 텔레메트리를
 * 공용 MQTT 브로커에 발행합니다. 실제 ESP32 게이트웨이 대신
 * 이 스크립트를 붙여도 대시보드가 동일하게 동작합니다.
 *
 * 사용법:
 *   npm install mqtt
 *   node scripts/mqtt-publisher.mjs
 *
 * 환경변수 (선택):
 *   MQTT_URL   기본값: mqtts://broker.hivemq.com:8883
 *   TOPIC_ROOT 기본값: portfolio/jw-iot
 *   INTERVAL   기본값: 500 (ms)
 */

import mqtt from "mqtt";

const MQTT_URL = process.env.MQTT_URL ?? "mqtts://broker.hivemq.com:8883";
const TOPIC_ROOT = process.env.TOPIC_ROOT ?? "portfolio/jw-iot";
const INTERVAL = Number(process.env.INTERVAL ?? 500);

const devices = [
  { id: "CS-A",  name: "냉동고 A",       kind: "cold_storage",     rated: 3500 },
  { id: "MD-01", name: "금속검출기 1호", kind: "metal_detector",   rated: 400  },
  { id: "FL-02", name: "충진기 2호",     kind: "filler",           rated: 1200 },
  { id: "ML-01", name: "밀링머신",       kind: "milling",          rated: 4800 },
  { id: "LC-00", name: "라인 컨트롤러",  kind: "line_controller",  rated: 220  },
];

const state = new Map(
  devices.map((d) => [d.id, { s: "running", temp: 20, vib: 0.4 }])
);

function noise(r) {
  return (Math.random() - 0.5) * 2 * r;
}

function nextTelemetry(d) {
  const cur = state.get(d.id);
  const roll = Math.random();
  if (cur.s === "running") {
    if (roll < 0.005) cur.s = "idle";
    else if (roll < 0.008) cur.s = "warning";
    else if (roll < 0.0085) cur.s = "error";
  } else if (cur.s === "idle" && roll < 0.02) cur.s = "running";
  else if (cur.s === "warning" && roll < 0.05) cur.s = "running";
  else if (cur.s === "error" && roll < 0.02) cur.s = "running";

  const factor =
    cur.s === "idle" ? 0.08 :
    cur.s === "warning" ? 0.9 :
    cur.s === "error" ? 0.02 : 0.75;

  const power = Math.max(0, d.rated * factor + noise(d.rated * 0.05));
  const temperature =
    d.kind === "cold_storage" ? -19 + noise(0.3) :
    d.kind === "milling"      ?  45 + noise(0.5) : undefined;
  const vibration =
    d.kind === "filler" || d.kind === "milling" || d.kind === "metal_detector"
      ? 0.5 + noise(0.15) : undefined;

  return {
    ts: Date.now(),
    id: d.id,
    name: d.name,
    kind: d.kind,
    state: cur.s,
    power: Number(power.toFixed(1)),
    ...(temperature !== undefined && { temperature: Number(temperature.toFixed(1)) }),
    ...(vibration !== undefined  && { vibration:  Number(vibration.toFixed(2)) }),
  };
}

const client = mqtt.connect(MQTT_URL, { reconnectPeriod: 2000 });

client.on("connect", () => {
  console.log(`[mqtt] connected → ${MQTT_URL}`);
  console.log(`[mqtt] publishing to ${TOPIC_ROOT}/<device>/telemetry every ${INTERVAL}ms`);
});

client.on("error", (err) => console.error("[mqtt] error:", err.message));

setInterval(() => {
  if (!client.connected) return;
  for (const d of devices) {
    const t = nextTelemetry(d);
    client.publish(`${TOPIC_ROOT}/${d.id}/telemetry`, JSON.stringify(t), { qos: 0 });
  }
}, INTERVAL);

process.on("SIGINT", () => {
  console.log("\n[mqtt] disconnecting…");
  client.end(false, () => process.exit(0));
});
