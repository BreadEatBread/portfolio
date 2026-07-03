import type { ModbusFunctionCode } from "./types";

export type FunctionMeta = {
  code: number;
  name: string;
  koreanName: string;
  description: string;
  requestFields: Array<"address" | "count" | "value" | "values">;
  supported: boolean;
};

export const functionCatalog: FunctionMeta[] = [
  {
    code: 0x01,
    name: "Read Coils",
    koreanName: "코일 읽기",
    description: "1비트 출력 상태를 여러 개 읽음",
    requestFields: ["address", "count"],
    supported: false,
  },
  {
    code: 0x02,
    name: "Read Discrete Inputs",
    koreanName: "이산 입력 읽기",
    description: "1비트 입력 상태를 여러 개 읽음",
    requestFields: ["address", "count"],
    supported: false,
  },
  {
    code: 0x03,
    name: "Read Holding Registers",
    koreanName: "홀딩 레지스터 읽기",
    description: "16비트 R/W 레지스터를 여러 개 읽음 (가장 자주 사용)",
    requestFields: ["address", "count"],
    supported: true,
  },
  {
    code: 0x04,
    name: "Read Input Registers",
    koreanName: "입력 레지스터 읽기",
    description: "16비트 read-only 레지스터를 여러 개 읽음",
    requestFields: ["address", "count"],
    supported: false,
  },
  {
    code: 0x05,
    name: "Write Single Coil",
    koreanName: "단일 코일 쓰기",
    description: "1비트 출력 하나를 ON/OFF (0xFF00 = ON, 0x0000 = OFF)",
    requestFields: ["address", "value"],
    supported: false,
  },
  {
    code: 0x06,
    name: "Write Single Register",
    koreanName: "단일 레지스터 쓰기",
    description: "16비트 레지스터 하나에 값을 씀",
    requestFields: ["address", "value"],
    supported: true,
  },
  {
    code: 0x0f,
    name: "Write Multiple Coils",
    koreanName: "다중 코일 쓰기",
    description: "여러 코일에 ON/OFF 상태를 한 번에 씀",
    requestFields: ["address", "values"],
    supported: false,
  },
  {
    code: 0x10,
    name: "Write Multiple Registers",
    koreanName: "다중 레지스터 쓰기",
    description: "여러 레지스터에 16비트 값을 한 번에 씀",
    requestFields: ["address", "values"],
    supported: true,
  },
];

export function fcMeta(code: number): FunctionMeta | undefined {
  return functionCatalog.find((f) => f.code === code);
}

export function isSupportedFc(code: number): code is ModbusFunctionCode {
  const m = fcMeta(code);
  return !!m?.supported;
}
