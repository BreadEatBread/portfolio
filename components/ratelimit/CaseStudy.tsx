import {
  BulletList,
  CaseStudyBlock,
  TradeoffCard,
} from "@/components/case-study/Layout";

export function RateLimitCaseStudy() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          Case Study
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          만들면서 정리한 것들
        </h2>
      </div>

      <div className="space-y-4">
        <CaseStudyBlock eyebrow="01 · Problem" title="Rate Limit 이 흔한데 왜 감이 없나">
          <p>
            &ldquo;Rate limit 필요해요&rdquo; 라는 요구는 실무에서 반드시 만난다.
            문제는 대부분{" "}
            <strong className="text-foreground font-medium">
              어떤 알고리즘을 왜 쓰는지 감이 없는 채
            </strong>{" "}
            로 Nginx 설정이나 API Gateway 옵션을 뒤진다는 것.
          </p>
          <p>
            글이 아니라{" "}
            <strong className="text-foreground font-medium">
              눈으로 굴려보는 도구
            </strong>
            가 있으면 훨씬 빨리 감이 잡힌다. 세 가지 표준 알고리즘 (Fixed
            Window · Sliding Window · Token Bucket) 을 하나의 서버 위에 얹고
            &ldquo;버스트 눌러보세요&rdquo; 로 바로 차이를 느끼도록.
          </p>
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="02 · Approach" title="구조">
          <BulletList
            items={[
              "알고리즘은 lib/ratelimit/algorithms.ts 에 순수 함수로 분리. 서버·테스트·문서 어디서든 같은 코드 재사용.",
              "app/api/ratelimit/route.ts (Edge Runtime) 이 알고리즘 선택 · 클라이언트 상태 관리 · 표준 429 응답 헤더(Retry-After, X-RateLimit-*) 처리.",
              "클라이언트 상태는 module-scope Map<clientId, ClientState> 로 유지. 10분 TTL. 브라우저마다 crypto.randomUUID() 로 clientId 를 발급.",
              "프론트엔드는 요청 결과·429 · 타임라인 · 알고리즘 내부 상태를 실시간으로 시각화 — 개념을 '읽는' 게 아니라 '보이게' 만든다.",
            ]}
          />
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="03 · Algorithms" title="세 알고리즘의 얼굴">
          <div className="space-y-6">
            <TradeoffCard
              decision="Fixed Window (창 하나에 카운터 하나)"
              pro="구현 초간단, 메모리 O(1). 시계 정렬만 잘 되면 어떤 언어로도 5분."
              con="창 경계에서 몰아치기(burst) 가 가능. 창이 바뀌는 순간 이론상 2×한도까지 통과."
            />
            <TradeoffCard
              decision="Sliding Window Log (실제 타임스탬프 리스트)"
              pro="경계 문제 없음, 정확도 최고. 실제로 창 안 요청 수를 셈."
              con="요청 수만큼 메모리 증가. Redis 로 옮기면 트리밍/키 관리가 은근 성가심."
            />
            <TradeoffCard
              decision="Token Bucket (버킷 하나 + 시간 계산)"
              pro="버스트 허용하면서 평균 속도 제한 — 사용자에게 가장 자연스러운 UX. 메모리 O(1). 정확도 충분."
              con="&ldquo;남은 예산&rdquo; 이 정수가 아니라 부동소수점 시각화가 약간 어색할 수 있음."
            />
          </div>
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="04 · Notes" title="실무로 옮기려면">
          <ul className="space-y-3 list-none">
            {[
              {
                k: "clientId 대신 IP · API 키 · 사용자 ID 로 교체하면 그대로 프로덕션.",
                v: "이 데모는 세션 격리를 위해 브라우저마다 다른 clientId 를 발급하지만, 실제 서비스는 대개 IP 나 인증 토큰으로 키를 잡는다. 알고리즘 자체는 그대로.",
              },
              {
                k: "Map 을 Redis 로 옮기고 TTL 은 EXPIRE 로.",
                v: "Vercel Edge 인스턴스가 회전하면 module-scope Map 이 통째로 사라진다. 프로덕션은 Redis(Upstash · Vercel KV) 로 상태를 밖으로 빼야 한다. Sliding Window Log 는 ZSET, Token Bucket 은 두 INCRBYFLOAT + 남은 시간 계산.",
              },
              {
                k: "표준 응답 헤더로 클라이언트에 '언제 재시도' 를 알려준다.",
                v: "Retry-After · X-RateLimit-Remaining · X-RateLimit-Reset 세 개만 잘 넣어도 클라이언트 SDK 가 알아서 백오프한다. 코드 몇 줄 차이로 협업 비용이 크게 줄어드는 지점.",
              },
            ].map((it, i) => (
              <li key={i}>
                <p className="text-foreground font-medium mb-1">{it.k}</p>
                <p className="text-muted text-sm leading-relaxed">{it.v}</p>
              </li>
            ))}
          </ul>
        </CaseStudyBlock>
      </div>
    </section>
  );
}
