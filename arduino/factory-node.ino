/*
 * Factory Live — ESP32 게이트웨이 예시
 *
 * 산업 장비(Modbus RTU 슬레이브)의 홀딩 레지스터를 RS485(TTL485)로
 * 읽어 Wi-Fi + MQTT 로 텔레메트리를 발행합니다. 서울소프트 SaaS MES
 * 도입 사례에서 사용한 구조를 축약해 놓은 스케치입니다.
 *
 * 하드웨어
 *   - ESP32-WROOM-32 (혹은 유사 보드)
 *   - MAX485 / SP3485 트랜시버 (TTL ↔ RS485)
 *   - RE/DE 핀은 함께 묶어 GPIO 하나로 방향 제어
 *
 * 배선
 *   ESP32 GPIO17 (TX)  → MAX485 DI
 *   ESP32 GPIO16 (RX)  → MAX485 RO
 *   ESP32 GPIO4        → MAX485 DE + RE   (방향 제어)
 *   MAX485 A/B         → 슬레이브 A/B
 *
 * 라이브러리 (Arduino IDE)
 *   - ModbusMaster (Doc Walker)
 *   - PubSubClient (Nick O'Leary)
 *
 * 데이터 흐름
 *   슬레이브 --RS485/RTU--> ESP32 --Wi-Fi/MQTT--> Broker --WSS--> Dashboard
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ModbusMaster.h>

// ─── 설정 (실제 사용 시 secrets 파일로 분리) ───────────────────────
const char* WIFI_SSID    = "YOUR_WIFI_SSID";
const char* WIFI_PASS    = "YOUR_WIFI_PASSWORD";
const char* MQTT_HOST    = "broker.hivemq.com";
const uint16_t MQTT_PORT = 1883;
const char* MQTT_TOPIC   = "portfolio/jw-iot/CS-A/telemetry";
const char* DEVICE_ID    = "CS-A";
const uint8_t SLAVE_ID   = 1;

// ─── 하드웨어 핀 ─────────────────────────────────────────────────
#define RS485_RX 16
#define RS485_TX 17
#define RS485_DE 4

HardwareSerial ModbusSerial(2);
ModbusMaster   node;
WiFiClient     wifiClient;
PubSubClient   mqtt(wifiClient);

// 방향 제어 콜백
void preTransmission()  { digitalWrite(RS485_DE, HIGH); }
void postTransmission() { digitalWrite(RS485_DE, LOW); }

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("[wifi] connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.printf("\n[wifi] connected: %s\n", WiFi.localIP().toString().c_str());
}

void connectMqtt() {
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  while (!mqtt.connected()) {
    String cid = String("jw-iot-") + DEVICE_ID + "-" + String((uint32_t)ESP.getEfuseMac(), HEX);
    Serial.printf("[mqtt] connecting as %s...\n", cid.c_str());
    if (mqtt.connect(cid.c_str())) {
      Serial.println("[mqtt] connected");
    } else {
      Serial.printf("[mqtt] retry rc=%d\n", mqtt.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RS485_DE, OUTPUT);
  digitalWrite(RS485_DE, LOW);

  ModbusSerial.begin(9600, SERIAL_8N1, RS485_RX, RS485_TX);
  node.begin(SLAVE_ID, ModbusSerial);
  node.preTransmission(preTransmission);
  node.postTransmission(postTransmission);

  connectWifi();
  connectMqtt();
}

void publishTelemetry(float temperature, float power, const char* state) {
  char payload[256];
  snprintf(payload, sizeof(payload),
    "{\"ts\":%lu,\"id\":\"%s\",\"state\":\"%s\","
    "\"temperature\":%.1f,\"power\":%.1f}",
    (unsigned long)millis(), DEVICE_ID, state, temperature, power);
  mqtt.publish(MQTT_TOPIC, payload);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWifi();
  if (!mqtt.connected()) connectMqtt();
  mqtt.loop();

  // 홀딩 레지스터 0x0000~0x0001 두 개를 읽어 온도/전력으로 해석
  uint8_t rc = node.readHoldingRegisters(0x0000, 2);
  if (rc == node.ku8MBSuccess) {
    // 슬레이브 스펙에 따라 스케일 팩터 적용
    float temperature = (int16_t)node.getResponseBuffer(0) / 10.0f;  // 0.1℃
    float power       = node.getResponseBuffer(1);                    // W
    const char* state = (power < 50.0f) ? "idle" : "running";
    publishTelemetry(temperature, power, state);
  } else {
    Serial.printf("[modbus] read failed rc=0x%02X\n", rc);
  }

  delay(500);
}
