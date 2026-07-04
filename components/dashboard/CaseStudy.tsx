import type { ReactNode } from "react";

type Block = {
  eyebrow: string;
  title: string;
  body: ReactNode;
};

const blocks: Block[] = [
  {
    eyebrow: "01 · Problem",
    title: "왜 만들었나",
    body: (
      <>
        <p>
          현업에서 다루는 산업 현장 IoT 데이터는{" "}
          <strong className="text-foreground font-medium">
            대부분 사내망 안에 갇혀 있다
          </strong>
          . 화면을 만들어도 밖으로 공유하기 어렵고, 데이터 흐름을 설명하려면
          말과 다이어그램만 남는다.
        </p>
        <p>
          이 프로젝트는 그 사이의 공백을 메우기 위한 데모다. 실제 하드웨어와
          데이터를 노출하지 않으면서도{" "}
          <strong className="text-foreground font-medium">
            같은 아키텍처가 어떻게 굴러가는지
          </strong>{" "}
          를 브라우저 하나로 보여준다.
        </p>
      </>
    ),
  },
  {
    eyebrow: "02 · Constraints",
    title: "제약 조건",
    body: (
      <ul className="space-y-2 list-none">
        {[
          "정적 배포만으로 동작 (Vercel/Cloudflare Pages 등). 별도 서버 없이 방문자가 즉시 확인.",
          "회사에서 만진 산출물의 로직/데이터는 재사용하지 않음. 도메인 감각만 가져옴.",
          "번들 크기 최소화. 실무에서 자주 쓰는 조합(Next.js + Recharts + Tailwind)만.",
          "코드가 곧 문서. 방문자가 소스 3개(Arduino / Node / 브라우저)를 한 페이지에서 다 볼 수 있어야 함.",
        ].map((t, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden
              className="mt-2 h-1 w-1 rounded-full bg-muted shrink-0"
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    eyebrow: "03 · Architecture",
    title: "구성",
    body: (
      <>
        <p>
          실제 배포된 이 페이지는{" "}
          <strong className="text-foreground font-medium">
            브라우저 시뮬레이터
          </strong>{" "}
          가 동작한다. 하지만 코드는 실제 프로덕션에서 쓸 수 있는 형태로
          작성했다:
        </p>
        <ArchDiagram />
        <p className="text-sm">
          <strong className="text-foreground font-medium">교체 지점</strong> —
          브라우저의{" "}
          <code className="font-mono text-xs text-foreground">useSimulator</code>{" "}
          훅을{" "}
          <code className="font-mono text-xs text-foreground">
            useMqttStream(topic)
          </code>{" "}
          같은 훅으로 바꾸면 동일한 UI로 실제 브로커에 붙는다. 데이터 형식은{" "}
          <code className="font-mono text-xs text-foreground">
            scripts/mqtt-publisher.mjs
          </code>{" "}
          와{" "}
          <code className="font-mono text-xs text-foreground">
            arduino/factory-node.ino
          </code>{" "}
          가 발행하는 JSON 스키마로 통일해 두었다.
        </p>
      </>
    ),
  },
  {
    eyebrow: "04 · Tradeoffs",
    title: "설계 결정과 트레이드오프",
    body: (
      <div className="space-y-6">
        <Tradeoff
          decision="시뮬레이터를 브라우저에서 굴린다"
          pro="정적 배포 + 즉시 데모. 서버 비용 0. 방문자에게 빠른 첫 인상."
          con="실제 MQTT 흐름을 보여주진 못함. 그래서 Node/Arduino 소스를 인라인 노출로 보완."
        />
        <Tradeoff
          decision="Recharts (React 네이티브) 채택"
          pro="접근성 좋은 SVG, Next.js SSR 친화적, 데이터 갱신 API가 단순."
          con="번들 사이즈가 D3 계열 중 큰 편. 가벼운 라인 하나면 사실 커스텀 SVG로 충분 (실제로 스파크라인은 커스텀)."
        />
        <Tradeoff
          decision="상태 전이는 확률 모델, 물리 시뮬레이션 X"
          pro="구현/유지보수 단순. UX 데모의 목적에 부합."
          con="실제 설비의 정확한 동특성을 재현하진 못함. 목적은 UI 검증이지 시뮬레이션이 아니라 OK."
        />
        <Tradeoff
          decision="다크 모드 강제, 라이트 모드 미지원"
          pro="공정 관제 화면 톤과 일치. 대비/포커스 관리가 단순해짐."
          con="일반 방문자에겐 눈부심 우려가 있음. 다만 이 페이지는 데모/기술 문서 성격이라 감수."
        />
      </div>
    ),
  },
  {
    eyebrow: "05 · Client → Server",
    title: "브라우저 시뮬레이터에서 서버 스트림으로",
    body: (
      <>
        <p>
          처음 버전은 시뮬레이터가 <strong className="text-foreground font-medium">브라우저 안에서 돌았다</strong>.
          정적 배포만으로 즉시 라이브 데모가 되니 초기엔 이상적. 하지만 결정적 단점 하나 —
          <em> 방문자마다 자기 우주가 열린다</em>. &quot;저 사람이 본 알람&quot; 과 &quot;내가 보는 알람&quot; 이
          다르니 공유·재현이 불가능하고, 실제 산업 시스템의 &quot;서버가 진실&quot; 을 시연할 수 없었다.
        </p>
        <p>
          그래서 시뮬레이터를 그대로 두고{" "}
          <code className="font-mono text-xs text-foreground">/api/dashboard/stream</code>{" "}
          Edge 라우트를 하나 더 붙였다. Vercel Edge Runtime 위에서{" "}
          <code className="font-mono text-xs text-foreground">ReadableStream</code>{" "}
          으로 <strong className="text-foreground font-medium">Server-Sent Events</strong> 를
          내려보내고, 브라우저는{" "}
          <code className="font-mono text-xs text-foreground">EventSource</code>{" "}
          로 구독한다. 상단 토글로 두 소스를 왔다갔다 하며 차이를 눈으로 느낄 수 있다.
        </p>
        <div className="space-y-6">
          <Tradeoff
            decision="Edge Runtime + SSE (WebSocket 대신)"
            pro="Vercel Serverless 는 WebSocket 을 잘 못 다룬다. SSE 는 단방향이라 브로커 없이 함수 하나로 스트림 유지. EventSource 는 자동 재연결까지 무료."
            con="양방향이 필요하면 결국 WebSocket 인프라(Ably·Pusher 등) 로 옮겨야 함. 지금은 관제 조회용이라 단방향으로 충분."
          />
          <Tradeoff
            decision="서버 시뮬레이터는 커넥션당 새로 생성"
            pro="세션 간 격리가 자연스럽고 서버 상태가 없어 배포·스케일 관리 쉬움."
            con="여러 브라우저가 동일한 알람을 봐야 하는 진짜 관제 시나리오는 아님. 공용 관제로 확장하려면 KV/DB 로 옮겨 단일 시뮬레이터를 pub/sub 로 팬아웃 필요."
          />
          <Tradeoff
            decision="Force State · Reset 을 서버 모드에서도 노출 (세션 매핑)"
            pro="클라이언트가 session UUID 를 발급 → SSE URL 과 POST /api/dashboard/control 이 같은 세션 시뮬레이터를 공유. 방문자가 UI 위에서 상태를 눌러도 서버가 진실. 브라우저 여러 개 열어보면 같은 소스에서 각자의 세션을 관제하는 그림이 됨."
            con="Edge 인스턴스가 회전하면 세션이 사라져 재연결이 필요함. 진짜 관제라면 세션 스토어를 KV/Redis 로 옮기고 시뮬레이터도 워커로 분리해야 함 (이 데모의 다음 단계)."
          />
        </div>
      </>
    ),
  },
  {
    eyebrow: "06 · Learnings",
    title: "만들면서 확인한 것",
    body: (
      <ul className="space-y-3 list-none">
        {[
          {
            k: "실시간 대시보드의 병목은 렌더링이 아니라 상태 구조다.",
            v: "데이터는 500ms마다 갱신되지만 각 카드가 개별 구독하도록 나누지 않으면 리스트 전체가 리렌더한다. 처음엔 단일 상태로 시작하고, 병목이 실측되면 세분화하는 편이 낫다.",
          },
          {
            k: "MQTT/SSE 는 브로커가 아니라 스키마 문제다.",
            v: "브로커·서버·브라우저·펌웨어 네 곳이 같은 JSON 을 받아 해석해야 한다. topic·이벤트 이름·필드명을 먼저 못박아 두면 나머지 구현은 그저 옮기는 일이 된다.",
          },
          {
            k: "코드를 보여주는 것 자체가 스토리다.",
            v: "'저장소 참고' 대신 페이지 내 소스뷰어를 두니, 데모/설명/증거가 한 스크롤에 모여 채용자에게 훨씬 강한 신호가 된다.",
          },
        ].map((it, i) => (
          <li key={i}>
            <p className="text-foreground font-medium mb-1">{it.k}</p>
            <p className="text-muted text-sm leading-relaxed">{it.v}</p>
          </li>
        ))}
      </ul>
    ),
  },
];

export function CaseStudy() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          Case Study
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          만들면서 고민한 것들
        </h3>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {blocks.map((b, i) => (
          <div
            key={b.eyebrow}
            className={`p-6 sm:p-8 ${
              i < blocks.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="grid gap-8 md:grid-cols-[180px_1fr]">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                  {b.eyebrow}
                </p>
                <h4 className="text-base font-semibold text-foreground">
                  {b.title}
                </h4>
              </div>
              <div className="space-y-4 text-muted leading-relaxed min-w-0">
                {b.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tradeoff({
  decision,
  pro,
  con,
}: {
  decision: string;
  pro: string;
  con: string;
}) {
  return (
    <div className="rounded border border-border/60 p-4">
      <p className="text-foreground font-medium mb-3">{decision}</p>
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1">
            얻은 것
          </p>
          <p className="text-muted">{pro}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
            감수한 것
          </p>
          <p className="text-muted">{con}</p>
        </div>
      </div>
    </div>
  );
}

function ArchDiagram() {
  return (
    <div className="my-4 -mx-6 sm:-mx-8 md:mx-0 overflow-x-auto">
      <div className="min-w-[560px] mx-6 sm:mx-8 md:mx-0 rounded border border-border/60 bg-background/40 p-4">
        <svg
          viewBox="0 0 640 260"
          className="w-full text-muted"
          role="img"
          aria-label="Data flow diagram"
        >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.6" />
          </marker>
        </defs>

        {[
          { x: 20, y: 100, w: 120, h: 56, title: "산업 설비", sub: "Modbus RTU slave" },
          { x: 180, y: 100, w: 120, h: 56, title: "ESP32", sub: "RS485 + Wi-Fi" },
          { x: 340, y: 100, w: 120, h: 56, title: "MQTT Broker", sub: "or HTTP API" },
          { x: 500, y: 100, w: 120, h: 56, title: "Dashboard", sub: "React / Recharts" },
        ].map((b, i) => (
          <g key={i}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <text
              x={b.x + b.w / 2}
              y={b.y + 22}
              fontSize="12"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              className="fill-foreground"
            >
              {b.title}
            </text>
            <text
              x={b.x + b.w / 2}
              y={b.y + 40}
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.6"
            >
              {b.sub}
            </text>
          </g>
        ))}

        {[
          { x1: 140, x2: 180, label: "RS485" },
          { x1: 300, x2: 340, label: "Wi-Fi" },
          { x1: 460, x2: 500, label: "WSS" },
        ].map((l, i) => (
          <g key={i}>
            <line
              x1={l.x1}
              y1={128}
              x2={l.x2 - 4}
              y2={128}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              markerEnd="url(#arrow)"
            />
            <text
              x={(l.x1 + l.x2) / 2}
              y={120}
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.5"
            >
              {l.label}
            </text>
          </g>
        ))}

        <g transform="translate(180,190)">
          <rect
            width="440"
            height="42"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
          />
          <text
            x="220"
            y="18"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.6"
          >
            공통 JSON 스키마: {"{ ts, id, state, power, temperature?, vibration? }"}
          </text>
          <text
            x="220"
            y="32"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.45"
          >
            펌웨어 · 퍼블리셔 · 브라우저 세 곳이 같은 스키마를 공유
          </text>
        </g>
        </svg>
      </div>
    </div>
  );
}
