export function EventBusFlow() {
  return (
    <div className="my-4 -mx-6 sm:-mx-8 md:mx-0 overflow-x-auto">
      <div className="min-w-[600px] mx-6 sm:mx-8 md:mx-0 rounded border border-border/60 bg-background/40 p-4">
        <svg
          viewBox="0 0 680 340"
          className="w-full text-muted"
          role="img"
          aria-label="이벤트 버스 발행/구독 흐름"
        >
          <defs>
            <marker
              id="arrow-bus"
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

          <g>
            <rect
              x="40"
              y="40"
              width="180"
              height="60"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <text x="130" y="64" fontSize="13" fontFamily="monospace" textAnchor="middle" className="fill-foreground" fill="currentColor">
              Tab A · Grid
            </text>
            <text x="130" y="82" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" opacity="0.6">
              POST /api/items
            </text>
          </g>

          <g>
            <rect
              x="270"
              y="30"
              width="180"
              height="80"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeDasharray="4 2"
            />
            <text x="360" y="56" fontSize="13" fontFamily="monospace" textAnchor="middle" className="fill-foreground" fill="currentColor">
              전역 ajaxSuccess
            </text>
            <text x="360" y="74" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" opacity="0.6">
              URL 패턴 → 리소스 추론
            </text>
            <text x="360" y="92" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" opacity="0.6">
              bus.emit("resource:item:updated")
            </text>
          </g>

          <g>
            <rect
              x="500"
              y="20"
              width="140"
              height="46"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <text x="570" y="40" fontSize="12" fontFamily="monospace" textAnchor="middle" className="fill-foreground" fill="currentColor">
              Tab B
            </text>
            <text x="570" y="56" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" opacity="0.6">
              bus.on(*, reload)
            </text>

            <rect
              x="500"
              y="80"
              width="140"
              height="46"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <text x="570" y="100" fontSize="12" fontFamily="monospace" textAnchor="middle" className="fill-foreground" fill="currentColor">
              Tab C
            </text>
            <text x="570" y="116" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor" opacity="0.6">
              bus.on(*, reload)
            </text>
          </g>

          <line x1="220" y1="70" x2="266" y2="70" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" markerEnd="url(#arrow-bus)" />
          <line x1="450" y1="60" x2="496" y2="42" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" markerEnd="url(#arrow-bus)" />
          <line x1="450" y1="80" x2="496" y2="102" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.4" markerEnd="url(#arrow-bus)" />

          <g transform="translate(40,180)">
            <rect
              width="600"
              height="120"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeDasharray="4 4"
            />
            <text x="300" y="28" fontSize="12" fontFamily="monospace" textAnchor="middle" className="fill-foreground" fill="currentColor">
              한 줄로 끝나는 구독
            </text>
            <text x="20" y="60" fontSize="12" fontFamily="monospace" fill="currentColor" opacity="0.85">
              // 이전 — 화면마다 개별 리스너
            </text>
            <text x="20" y="78" fontSize="12" fontFamily="monospace" fill="currentColor" opacity="0.6">
              $(document).on("item:saved", fn); ... 36개 화면 곱하기 여러 이벤트
            </text>
            <text x="20" y="98" fontSize="12" fontFamily="monospace" fill="currentColor" opacity="0.85">
              // 이후 — 리소스 별로 한 줄
            </text>
            <text x="20" y="116" fontSize="12" fontFamily="monospace" fill="currentColor" opacity="0.6">
              bus.on("resource:item:*", () =&gt; grid.reload());
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
