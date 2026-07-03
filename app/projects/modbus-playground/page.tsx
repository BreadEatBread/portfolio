import type { Metadata } from "next";
import { ModbusCaseStudy } from "@/components/modbus/CaseStudy";
import { Playground } from "@/components/modbus/Playground";

export const metadata: Metadata = {
  title: "Modbus Playground · 김정웅",
  description:
    "Modbus RTU 요청 프레임을 브라우저에서 조립·파싱·CRC 검증하는 도구. ESP32 게이트웨이 디버깅용 사이드 프로젝트.",
};

export default function ModbusPlaygroundPage() {
  return (
    <main className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-14">
        <Playground />
        <ModbusCaseStudy />
      </div>
    </main>
  );
}
