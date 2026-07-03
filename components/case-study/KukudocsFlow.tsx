export function KukudocsFlow() {
  return (
    <div className="my-4 -mx-6 sm:-mx-8 md:mx-0 overflow-x-auto">
      <div className="min-w-[600px] mx-6 sm:mx-8 md:mx-0 rounded border border-border/60 bg-background/40 p-4">
        <svg
          viewBox="0 0 680 320"
          className="w-full text-muted"
          role="img"
          aria-label="Parent 창과 Kukudocs iframe 간 저장 흐름"
        >
          <defs>
            <marker
              id="arrow-flow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.6" />
            </marker>
          </defs>

          {[
            { x: 40, y: 40, w: 220, h: 60, title: "Parent (WeSM)", sub: "저장 버튼 · Save 오케스트레이션" },
            { x: 420, y: 40, w: 220, h: 60, title: "Kukudocs iframe", sub: "에디터 내부 편집 상태" },
            { x: 40, y: 240, w: 220, h: 60, title: "Server API", sub: "POST /api/documents/{id}" },
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
                y={b.y + 24}
                fontSize="13"
                fontFamily="monospace"
                textAnchor="middle"
                fill="currentColor"
                className="fill-foreground"
              >
                {b.title}
              </text>
              <text
                x={b.x + b.w / 2}
                y={b.y + 44}
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

          <line
            x1="260"
            y1="60"
            x2="416"
            y2="60"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.4"
            markerEnd="url(#arrow-flow)"
          />
          <text
            x="338"
            y="52"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.75"
          >
            postMessage {"{ type: FORCE_COMMIT }"}
          </text>

          <line
            x1="416"
            y1="90"
            x2="260"
            y2="90"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.4"
            markerEnd="url(#arrow-flow)"
          />
          <text
            x="338"
            y="108"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.75"
          >
            postMessage {"{ type: COMMITTED, html }"}
          </text>

          <line
            x1="150"
            y1="100"
            x2="150"
            y2="236"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.4"
            markerEnd="url(#arrow-flow)"
          />
          <text
            x="164"
            y="180"
            fontSize="11"
            fontFamily="monospace"
            fill="currentColor"
            opacity="0.75"
          >
            fetch(save)
          </text>

          <g transform="translate(300,170)">
            <rect
              width="340"
              height="70"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeDasharray="4 4"
            />
            <text
              x="170"
              y="26"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.6"
            >
              메시지 계약
            </text>
            <text
              x="170"
              y="46"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.5"
            >
              type: string · payload: object · nonce: 요청·응답 매칭
            </text>
            <text
              x="170"
              y="60"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.5"
            >
              timeout: 5s → 부모 측에서 재시도 or 저장 취소
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
