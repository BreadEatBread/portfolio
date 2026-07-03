export function ModbusCaseStudy() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          Case Study
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          왜 만들었나
        </h2>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Block
          eyebrow="01 · Problem"
          title="반복되는 손 계산"
          body={
            <>
              <p>
                ESP32 로 산업 장비를 연동할 때 매번 하는 일이 같다. 슬레이브 ID
                맞추고, function code 확인하고, 주소·개수를 hi/lo 로 쪼갠 뒤 CRC
                를 붙이는 것. 특히{" "}
                <strong className="text-foreground font-medium">
                  CRC 가 안 맞아서 응답이 안 오는 상황
                </strong>
                은 시리얼 툴 하나 만으로 원인을 좁히기 어렵다.
              </p>
              <p>
                &quot;내가 보낸 프레임이 스펙대로 조립됐는지&quot; 를 눈으로 확인할 수
                있는 도구가 있으면 필드 튜닝이 훨씬 빨라진다.
              </p>
            </>
          }
        />
        <Block
          eyebrow="02 · Approach"
          title="브라우저 안에서 완결"
          body={
            <ul className="space-y-2 list-none">
              {[
                "타입 안전한 CRC-16 Modbus 구현 (다항식 0xA001, 초기값 0xFFFF)",
                "FC 03/06/16 프레임 빌더 — 필드 입력에 따라 요구되는 바이트가 자동으로 붙고 빠짐",
                "역방향 파서 — hex 붙여넣기 → 필드별 색상, CRC 재계산 후 일치 여부 표시",
                "프리셋 라이브러리 — PZEM 전력계, 단일/다중 레지스터 쓰기 등 현장 반복 요청",
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
          }
        />
        <Block
          eyebrow="03 · Design choices"
          title="포기한 것 / 남긴 것"
          body={
            <div className="space-y-4">
              <Row
                left="지원 함수 코드 3종만 (03/06/16)"
                right="현장에서 실제로 쓰는 조합에 집중. 나머지 코드는 카탈로그에 표시만."
              />
              <Row
                left="응답 프레임 파싱은 요청과 동일 파서로 흉내"
                right="응답은 함수 코드별로 구조가 달라서 정식 지원은 후속 작업. 지금은 요청 검증에 쓰기 위한 파서."
              />
              <Row
                left="서버·API 없음"
                right="브라우저 안에서만 계산. 프라이버시 걱정 없이 어떤 hex 든 붙여넣기 가능."
              />
            </div>
          }
        />
      </div>
    </section>
  );
}

function Block({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="p-6 sm:p-8 border-b border-border last:border-b-0">
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
            {eyebrow}
          </p>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <div className="space-y-4 text-muted leading-relaxed min-w-0">
          {body}
        </div>
      </div>
    </div>
  );
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 rounded border border-border/60 p-4 text-sm">
      <p className="text-foreground font-medium">{left}</p>
      <p className="text-muted">{right}</p>
    </div>
  );
}
