import type { Metadata } from "next";
import { CaseStudy } from "@/components/dashboard/CaseStudy";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SourceViewer } from "@/components/dashboard/SourceViewer";

export const metadata: Metadata = {
  title: "Factory Live · 김정웅",
  description:
    "가상의 공장 설비 5대를 실시간 시뮬레이션하는 IoT 대시보드. ESP32/Modbus RTU 기반 게이트웨이 구조의 프론트엔드 예시.",
};

export default function IotDashboardPage() {
  return (
    <main id="main" className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <Dashboard />
        <CaseStudy />
        <SourceViewer />
      </div>
    </main>
  );
}
