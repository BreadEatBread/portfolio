export type ModbusFunctionCode = 0x03 | 0x06 | 0x10;

export type ByteRole =
  | "slave"
  | "function"
  | "address"
  | "count"
  | "byteCount"
  | "data"
  | "value"
  | "crc";

export type LabeledByte = {
  value: number;
  role: ByteRole;
  label: string;
};

export type ParsedFrame = {
  bytes: LabeledByte[];
  slaveId: number;
  functionCode: number;
  functionName: string;
  address?: number;
  count?: number;
  value?: number;
  data?: number[];
  crc: number;
  crcOk: boolean;
  computedCrc: number;
  errors: string[];
};

export type BuildRequest = {
  slaveId: number;
  functionCode: ModbusFunctionCode;
  address: number;
  count?: number;
  value?: number;
  values?: number[];
};
