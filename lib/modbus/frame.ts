import { crc16Bytes, verifyFrameCrc } from "./crc";
import { fcMeta } from "./functions";
import type {
  BuildRequest,
  LabeledByte,
  ParsedFrame,
} from "./types";

function u16(hi: number, lo: number) {
  return ((hi & 0xff) << 8) | (lo & 0xff);
}

function hiLo(v: number): [number, number] {
  return [(v >> 8) & 0xff, v & 0xff];
}

export function buildRequest(req: BuildRequest): LabeledByte[] {
  const bytes: LabeledByte[] = [];
  const raw: number[] = [];

  const push = (v: number, role: LabeledByte["role"], label: string) => {
    bytes.push({ value: v & 0xff, role, label });
    raw.push(v & 0xff);
  };

  push(req.slaveId, "slave", "Slave ID");
  push(req.functionCode, "function", "Function code");

  const [aHi, aLo] = hiLo(req.address);
  push(aHi, "address", "Address high");
  push(aLo, "address", "Address low");

  if (req.functionCode === 0x03) {
    const count = req.count ?? 1;
    const [cHi, cLo] = hiLo(count);
    push(cHi, "count", "Register count high");
    push(cLo, "count", "Register count low");
  } else if (req.functionCode === 0x06) {
    const value = req.value ?? 0;
    const [vHi, vLo] = hiLo(value);
    push(vHi, "value", "Value high");
    push(vLo, "value", "Value low");
  } else if (req.functionCode === 0x10) {
    const values = req.values ?? [];
    const [cHi, cLo] = hiLo(values.length);
    push(cHi, "count", "Register count high");
    push(cLo, "count", "Register count low");
    push(values.length * 2, "byteCount", "Byte count");
    for (let i = 0; i < values.length; i++) {
      const [hi, lo] = hiLo(values[i]);
      push(hi, "data", `Reg[${i}] high`);
      push(lo, "data", `Reg[${i}] low`);
    }
  }

  const [crcLo, crcHi] = crc16Bytes(raw);
  bytes.push({ value: crcLo, role: "crc", label: "CRC low" });
  bytes.push({ value: crcHi, role: "crc", label: "CRC high" });

  return bytes;
}

export function parseHexString(input: string): number[] {
  const cleaned = input
    .replace(/0x/gi, "")
    .replace(/[,;|]/g, " ")
    .trim();
  if (!cleaned) return [];
  const tokens = cleaned.split(/\s+/);
  const out: number[] = [];

  const tryPushByte = (t: string) => {
    if (!/^[0-9a-fA-F]{1,2}$/.test(t)) {
      throw new Error(`유효하지 않은 hex 토큰: ${t}`);
    }
    out.push(parseInt(t, 16));
  };

  if (tokens.length === 1 && tokens[0].length > 2) {
    const t = tokens[0];
    if (t.length % 2 !== 0) throw new Error("hex 문자열 길이가 홀수입니다.");
    for (let i = 0; i < t.length; i += 2) tryPushByte(t.slice(i, i + 2));
    return out;
  }

  for (const t of tokens) tryPushByte(t);
  return out;
}

export function parseRequestFrame(input: number[]): ParsedFrame {
  const errors: string[] = [];
  if (input.length < 4) {
    errors.push("프레임이 너무 짧습니다 (최소 4바이트).");
  }
  const bytes: LabeledByte[] = [];
  const push = (v: number, role: LabeledByte["role"], label: string) =>
    bytes.push({ value: v & 0xff, role, label });

  const slaveId = input[0] ?? 0;
  const functionCode = input[1] ?? 0;
  const meta = fcMeta(functionCode);

  push(slaveId, "slave", "Slave ID");
  push(functionCode, "function", `Function ${meta?.name ?? "unknown"}`);

  let address: number | undefined;
  let count: number | undefined;
  let value: number | undefined;
  let data: number[] | undefined;

  const dataArea = input.slice(2, input.length - 2);
  const crcArea = input.slice(input.length - 2);

  if (functionCode === 0x03 || functionCode === 0x04) {
    if (dataArea.length >= 4) {
      address = u16(dataArea[0], dataArea[1]);
      count = u16(dataArea[2], dataArea[3]);
      push(dataArea[0], "address", "Address high");
      push(dataArea[1], "address", "Address low");
      push(dataArea[2], "count", "Count high");
      push(dataArea[3], "count", "Count low");
    } else {
      errors.push("FC 0x03/0x04 요청은 데이터 4바이트 필요.");
      dataArea.forEach((v, i) => push(v, "data", `Data[${i}]`));
    }
  } else if (functionCode === 0x06) {
    if (dataArea.length >= 4) {
      address = u16(dataArea[0], dataArea[1]);
      value = u16(dataArea[2], dataArea[3]);
      push(dataArea[0], "address", "Address high");
      push(dataArea[1], "address", "Address low");
      push(dataArea[2], "value", "Value high");
      push(dataArea[3], "value", "Value low");
    } else {
      errors.push("FC 0x06 요청은 데이터 4바이트 필요.");
      dataArea.forEach((v, i) => push(v, "data", `Data[${i}]`));
    }
  } else if (functionCode === 0x10) {
    if (dataArea.length >= 5) {
      address = u16(dataArea[0], dataArea[1]);
      count = u16(dataArea[2], dataArea[3]);
      const byteCount = dataArea[4];
      push(dataArea[0], "address", "Address high");
      push(dataArea[1], "address", "Address low");
      push(dataArea[2], "count", "Count high");
      push(dataArea[3], "count", "Count low");
      push(byteCount, "byteCount", "Byte count");
      const dataBytes = dataArea.slice(5);
      if (byteCount !== dataBytes.length) {
        errors.push(
          `byte count (${byteCount}) 와 실제 데이터 길이 (${dataBytes.length}) 가 일치하지 않습니다.`,
        );
      }
      data = [];
      for (let i = 0; i + 1 < dataBytes.length; i += 2) {
        data.push(u16(dataBytes[i], dataBytes[i + 1]));
        push(dataBytes[i], "data", `Reg[${i / 2}] high`);
        push(dataBytes[i + 1], "data", `Reg[${i / 2}] low`);
      }
    } else {
      errors.push("FC 0x10 요청은 최소 5바이트 데이터가 필요합니다.");
      dataArea.forEach((v, i) => push(v, "data", `Data[${i}]`));
    }
  } else {
    if (meta) {
      errors.push(
        `${meta.name} (0x${functionCode.toString(16).padStart(2, "0")}) 는 지금 이 도구에서 상세 파싱을 지원하지 않습니다. 프리셋으로 FC 03/06/10 을 사용해 보세요.`,
      );
    } else {
      errors.push(
        `알 수 없는 function code 0x${functionCode.toString(16).padStart(2, "0")}.`,
      );
    }
    dataArea.forEach((v, i) => push(v, "data", `Data[${i}]`));
  }

  if (crcArea.length === 2) {
    push(crcArea[0], "crc", "CRC low");
    push(crcArea[1], "crc", "CRC high");
  }

  const { ok: crcOk, expected, actual } = verifyFrameCrc(input);
  if (!crcOk && input.length >= 4) {
    errors.push(
      `CRC 불일치 — 기대 0x${expected
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()}, 실제 0x${actual
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()}`,
    );
  }

  return {
    bytes,
    slaveId,
    functionCode,
    functionName: meta?.name ?? "Unknown",
    address,
    count,
    value,
    data,
    crc: actual,
    computedCrc: expected,
    crcOk,
    errors,
  };
}

export function bytesToHexString(bytes: LabeledByte[] | number[]): string {
  return (bytes as Array<LabeledByte | number>)
    .map((b) =>
      (typeof b === "number" ? b : b.value)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase(),
    )
    .join(" ");
}
