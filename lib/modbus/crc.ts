/**
 * CRC-16 Modbus (RTU) 계산.
 *
 * - 다항식: 0xA001 (0x8005의 reflected form)
 * - 초기값: 0xFFFF
 * - 비트별 XOR + shift, 최하위 비트가 1이면 다항식과 XOR
 *
 * 결과는 16비트 정수. 전송 시엔 LOW 바이트 → HIGH 바이트 순서.
 */
export function crc16Modbus(bytes: number[]): number {
  let crc = 0xffff;
  for (const raw of bytes) {
    const b = raw & 0xff;
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x0001) {
        crc = (crc >>> 1) ^ 0xa001;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return crc & 0xffff;
}

/** CRC를 [low, high] 두 바이트로 반환 (송신 순서와 동일). */
export function crc16Bytes(bytes: number[]): [number, number] {
  const crc = crc16Modbus(bytes);
  return [crc & 0xff, (crc >> 8) & 0xff];
}

/** 프레임에서 CRC 필드를 뺀 payload를 재계산해 유효성 확인. */
export function verifyFrameCrc(frame: number[]): {
  ok: boolean;
  expected: number;
  actual: number;
} {
  if (frame.length < 4) {
    return { ok: false, expected: 0, actual: 0 };
  }
  const payload = frame.slice(0, frame.length - 2);
  const expected = crc16Modbus(payload);
  const actual =
    (frame[frame.length - 1] << 8) | frame[frame.length - 2];
  return { ok: expected === actual, expected, actual };
}
