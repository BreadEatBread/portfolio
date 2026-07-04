"use client";

import { useState } from "react";
import { BackToPortfolioLink } from "@/components/BackToPortfolioLink";
import { BuilderState, FrameBuilder } from "./FrameBuilder";
import { FrameDecoder } from "./FrameDecoder";
import { PresetLibrary } from "./PresetLibrary";

const initial: BuilderState = {
  slaveId: 1,
  functionCode: 0x03,
  address: 0x0000,
  count: 2,
  value: 0,
  valuesInput: "0x00FF 100 0",
};

export function Playground() {
  const [state, setState] = useState<BuilderState>(initial);

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-2">
          <BackToPortfolioLink />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Tool · Modbus RTU
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Modbus Playground
        </h1>
        <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
          Modbus RTU 요청 프레임을 브라우저에서 조립·파싱·CRC 검증합니다.
          ESP32 게이트웨이 개발이나 시리얼 콘솔 디버깅 도중 스펙을 되짚어보고 싶을 때
          한 페이지에서 끝내려고 만든 도구입니다.
        </p>
      </div>

      <Section
        eyebrow="Builder"
        title="요청 프레임 조립"
        description="입력값을 바꾸면 바이트 배열과 CRC 가 실시간으로 재계산됩니다. 하단 hex 문자열은 그대로 시리얼 툴에 붙여넣을 수 있어요."
      >
        <FrameBuilder state={state} onChange={setState} />
      </Section>

      <Section
        eyebrow="Presets"
        title="자주 쓰는 프레임"
        description="현장에서 반복적으로 만드는 요청들. 클릭하면 Builder 값이 갈아 끼워집니다."
      >
        <PresetLibrary onSelect={setState} active={state} />
      </Section>

      <Section
        eyebrow="Decoder"
        title="응답·요청 파싱"
        description="시리얼 캡처 결과를 붙여넣으면 필드별로 색을 입혀 보여주고, CRC 를 다시 계산해 유효성을 검사합니다."
      >
        <FrameDecoder />
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          {eyebrow}
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}
