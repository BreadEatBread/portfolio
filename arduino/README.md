# Arduino / ESP32 하드웨어 스케치

Factory Live 대시보드에 실제 산업 장비 데이터를 흘려보내는 게이트웨이 예시입니다.

## 파일

- `factory-node.ino` — ESP32 + MAX485 트랜시버로 Modbus RTU 슬레이브를 읽어 MQTT 로 발행

## 준비물

| 항목 | 비고 |
|---|---|
| ESP32-WROOM-32 개발보드 | 또는 ESP32-S3/S2 |
| MAX485 / SP3485 트랜시버 | RE, DE 는 하나로 묶어 GPIO 하나로 제어 |
| Modbus RTU 슬레이브 장비 | 온도계, 전력계 (PZEM-004T 등) |
| RS485 배선 (twisted pair) | 종단 저항 120Ω × 2 |

## Arduino IDE 라이브러리

- ModbusMaster (Doc Walker)
- PubSubClient (Nick O'Leary)

## 실행 흐름

```
슬레이브(레지스터)
     ↓ RS485 / RTU (9600 8N1)
ESP32 UART2 + MAX485
     ↓ Wi-Fi + MQTT (mqtts:1883)
Broker
     ↓ WSS
브라우저 대시보드
```

## 실제 운영 팁

- `secrets.h` 로 Wi-Fi / MQTT 자격증명 분리
- `mqtts://` 포트 8883 사용 시 `WiFiClientSecure` + 브로커 CA 필요
- 슬레이브 응답이 없을 때 지수 백오프
- 다수 슬레이브를 폴링할 경우 슬레이브 ID 순회 + 프레임 간 최소 3.5 문자시간 대기
