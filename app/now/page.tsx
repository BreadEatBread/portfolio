import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now · 김정웅",
  description:
    "요즘 배우고, 만들고, 쓰고 있는 것들. 김정웅의 현재 관심사 스냅샷.",
};

const UPDATED_AT = "2026-07-04";

type Block = {
  eyebrow: string;
  title: string;
  items: string[];
};

const blocks: Block[] = [
  {
    eyebrow: "Working on",
    title: "지금 만들고 있는 것",
    items: [
      "서울소프트 SaaS MES — 도입업체 기준정보 유지보수와 IoT 게이트웨이(ESP32 + Modbus RTU) 안정화.",
      "이 포트폴리오 사이트 — Next.js Edge SSE, 커맨드 팔레트, 가상 스크롤 그리드까지 실전 스택을 하나씩 실험 중.",
      "금속검출기 · 급속냉동고 전력 계측(PZEM · Shelly Plug · Tapo P110 비교) 필드 검토.",
    ],
  },
  {
    eyebrow: "Learning",
    title: "요즘 파고 있는 것",
    items: [
      "Edge Runtime · SSE · WebSocket 의 실제 트래픽/타임아웃 특성.",
      "React 렌더링 병목을 언제 상태 세분화·언제 useMemo 로 잡을지 감을 기르는 중.",
      "Modbus RTU 프로토콜을 파서·CRC 수준까지 복습해서 field debugging 시간 단축.",
    ],
  },
  {
    eyebrow: "Reading",
    title: "책상 위의 참고 자료",
    items: [
      "Modbus over Serial Line Specification v1.02 — 여전히 가장 압축적인 원전.",
      "PatternFly · Radix UI 컴포넌트 설계 노트 — 접근성/키보드 UX 참고.",
      "Vercel Edge Runtime 문서 — 스트리밍 응답과 타임아웃 처리 경계.",
    ],
  },
  {
    eyebrow: "Tools",
    title: "매일 쓰는 도구",
    items: [
      "에디터 · VS Code (+ GitHub Copilot / Claude Code) — 페어 프로그래밍 파트너.",
      "터미널 · Warp — 블록 UI · AI 명령어 제안 · 워크플로우.",
      "커뮤니케이션 · Slack / 카톡 / Discord.",
      "노트 · Obsidian 로 필드 노트와 코드 스니펫 정리.",
    ],
  },
];

export default function NowPage() {
  return (
    <main id="main" className="flex-1 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <span aria-hidden>←</span> 포트폴리오로
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Now · {UPDATED_AT}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            요즘 뭐하고 있냐면
          </h1>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            &ldquo;Now 페이지&rdquo; 는 <em>지금 이 순간</em> 무엇에 시간을 쓰고
            있는지 스냅샷으로 남기는 관례입니다 (
            <a
              className="underline decoration-border underline-offset-2 hover:text-foreground"
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              nownownow.com
            </a>
            ). 이력서·프로젝트가 &ldquo;누적된 과거&rdquo; 라면, 이 페이지는
            &ldquo;오늘의 관심 표면&rdquo; 입니다.
          </p>
        </header>

        <div className="space-y-4">
          {blocks.map((b) => (
            <section
              key={b.eyebrow}
              className="rounded-lg border border-border bg-card p-6 sm:p-7"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                {b.eyebrow}
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
                {b.title}
              </h2>
              <ul className="space-y-2.5">
                {b.items.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
                    <span
                      aria-hidden
                      className="mt-2 h-1 w-1 rounded-full bg-muted shrink-0"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-xs text-muted text-center">
          마지막 업데이트 · <time dateTime={UPDATED_AT}>{UPDATED_AT}</time>
        </p>
      </div>
    </main>
  );
}
