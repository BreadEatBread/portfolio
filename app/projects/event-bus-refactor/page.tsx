import type { Metadata } from "next";
import {
  BulletList,
  CaseStudyBlock,
  CaseStudyLayout,
  TradeoffCard,
} from "@/components/case-study/Layout";
import { EventBusDemo } from "@/components/case-study/EventBusDemo";
import { EventBusFlow } from "@/components/case-study/EventBusFlow";

export const metadata: Metadata = {
  title: "이벤트 버스 리팩토링 · 김정웅",
  description:
    "iframe 기반 다중 탭 시스템에서 데이터 동기화 문제를 전역 ajaxSuccess 훅 + 이벤트 버스로 해결한 이야기. 36개 화면을 한 줄 선언으로 옮긴 아키텍처.",
};

export default function EventBusRefactorPage() {
  return (
    <CaseStudyLayout
      eyebrow="Case Study · Frontend Architecture"
      title="탭 사이에 흐르는 이벤트 버스 만들기"
      subtitle="SaaS MES · 서울소프트 (2026)"
      description="iframe 기반 다중 탭 SaaS 안에서 다른 탭의 데이터 변경이 반영되지 않던 문제를, 전역 ajaxSuccess 훅과 pub/sub 이벤트 버스로 정리해 36개 화면에 한 줄 선언만으로 확산시킨 리팩토링 이야기. 하단에 재구현한 미니 데모가 있습니다."
    >
      <CaseStudyBlock eyebrow="01 · Problem" title="옆 탭이 조용히 낡아간다">
        <p>
          SaaS MES 는 사용자가 여러 화면을 열어두고 병렬로 일한다. 화면 각각은{" "}
          <strong className="text-foreground font-medium">iframe 탭</strong>{" "}
          안의 독립된 그리드. 문제는 사용자가 Tab A 에서 품목을 수정하면 Tab B
          의 목록은 아무 일도 없다는 듯 예전 데이터를 계속 보여주는 것.
        </p>
        <p>
          현장에서는 <strong className="text-foreground font-medium">
          "방금 고쳤는데 저기 안 바뀌었네요"
          </strong>
          라는 컴플레인이 반복적으로 들어왔다. 매번 F5. 사용자가 뭘 봐야
          믿을지 모르는 상태 = 데이터 신뢰가 무너지는 지점.
        </p>
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="02 · Constraints" title="확산 비용을 어떻게 낮출까">
        <BulletList
          items={[
            "화면이 36개. 한 화면씩 리스너를 붙이러 다니는 방식은 유지보수 지옥이 확정.",
            "iframe 이라서 window 는 화면마다 다르지만, 각 iframe 은 공통 부모 window 를 참조할 수 있음.",
            "기존 코드가 jQuery ajax 기반. 새로운 REST 클라이언트를 도입하는 리팩토링은 범위 초과.",
            "가급적 「화면에 한 줄만 추가」 로 구독이 끝나야 확산이 자연스럽다.",
          ]}
        />
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="03 · Approach" title="ajaxSuccess 를 이벤트 원점으로 삼는다">
        <p>
          핵심 아이디어: 모든 mutation 은 결국{" "}
          <span className="font-mono text-foreground">POST/PUT/DELETE</span>{" "}
          응답이 성공했을 때 발생한다. 그 순간을 잡아서 이벤트 버스에 흘려 보내면,
          개별 화면은 그저 자기가 관심 있는 리소스만 구독하면 된다.
        </p>

        <EventBusFlow />

        <BulletList
          items={[
            "부모 window 에 pub/sub bus 하나만 노출.",
            "전역 ajaxSuccess 훅이 요청 URL·메서드를 보고 resource type 을 추론 (예: /api/items/* + PUT → resource:item:updated).",
            "각 화면(iframe)은 mount 시점에 관심 리소스만 구독. bus.on(\"resource:item:*\", reload).",
            "36개 화면에 순차 적용. 화면 당 실제 코드 변경은 한 줄 선언.",
          ]}
        />
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="04 · Try it" title="라이브 데모">
        <p>
          아래는 이벤트 버스 패턴을 <strong className="text-foreground font-medium">
          재구현한 최소 데모
          </strong>
          입니다. 회사 코드는 사용하지 않았고, 3개 "탭" 이 하나의 공통
          bus 로 연결돼 있다고 상상하시면 됩니다.
        </p>
        <p>
          아무 탭에서든 <em>"품목 A 수정"</em> 을 누르면 서버 상태가
          바뀝니다. 이벤트 버스가 ON 이면 옆 탭들이 자동으로 최신 스냅샷을
          받아오고, OFF 면 STALE 뱃지가 뜨는 걸 볼 수 있어요.
        </p>
        <EventBusDemo />
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="05 · Tradeoffs" title="설계 결정과 트레이드오프">
        <div className="space-y-6">
          <TradeoffCard
            decision="전역 ajaxSuccess 훅 (분산 리스너 X)"
            pro="새 mutation 이 생겨도 훅 하나만 알면 됨. 화면 개수 만큼 리스너를 등록·해제하지 않아도 됨."
            con="'감지되지 않는 요청' 이 있으면 이벤트가 아예 안 흐름. RESTful 하지 않은 엔드포인트는 명시적 발행이 필요."
          />
          <TradeoffCard
            decision="URL 패턴으로 리소스 타입 추론"
            pro="사이드 이펙트 없이 URL 만 보고 이벤트를 만들 수 있음. 서버 응답을 다시 뜯어보지 않아도 됨."
            con="URL 규칙이 바뀌면 훅이 조용히 잘못된 이벤트를 뿌림. 훅 안에 리소스 매핑 테스트가 필수."
          />
          <TradeoffCard
            decision="구독한 화면은 전체 grid.reload()"
            pro="'뭐가 바뀌었는지' 상세 계산 없이도 즉시 최신 상태로 수렴. 구현 매우 단순."
            con="큰 그리드가 여러 개 켜져 있을 때 네트워크 낭비. 특정 row 만 업데이트하는 최적화는 후속 과제."
          />
          <TradeoffCard
            decision="한 줄 선언 (bus.on) 을 목표 UX 로"
            pro="새 화면 팀원도 5분 만에 구독. 문서화·리뷰 비용 급감."
            con="한 줄 안에 숨은 규칙(패턴 매칭, 자동 unsubscribe) 을 알아야 디버깅 가능. 훅 문서화가 유일한 안전망."
          />
        </div>
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="06 · Learnings" title="다시 하게 된다면">
        <ul className="space-y-3 list-none">
          {[
            {
              k: "인프라 개선의 가치는 '팀원이 신경 쓸 표면적' 을 얼마나 줄였느냐로 계량된다.",
              v: "36개 화면에 각각 리스너를 붙이는 세계 vs 한 줄로 끝나는 세계. 코드 라인 수 차이보다 다음 화면 담당자의 인지 부하 차이가 훨씬 크다. 인프라 리팩토링을 정당화할 때 이 각도로 서술하면 설득이 빨라진다.",
            },
            {
              k: "URL 규칙에 의존하는 자동화는 반드시 테스트로 잠그자.",
              v: "훅이 조용히 잘못된 이벤트를 뿌리는 실패는 관찰이 매우 어렵다. mutation URL 목록을 픽스처로 잡고 매핑 테스트를 자동화한 이후로 밤에 잘 잠.",
            },
            {
              k: "패턴 도입은 '가장 아픈 화면' 부터.",
              v: "36개 중 컴플레인이 몰리던 5~6개 화면에 먼저 적용해서 효과를 확인한 뒤 나머지에 순차 확산. 큰 리팩토링을 '한 방에' 하지 않으니 롤백 지점이 짧고 리뷰 부담도 적다.",
            },
          ].map((it, i) => (
            <li key={i}>
              <p className="text-foreground font-medium mb-1">{it.k}</p>
              <p className="text-muted text-sm leading-relaxed">{it.v}</p>
            </li>
          ))}
        </ul>
      </CaseStudyBlock>
    </CaseStudyLayout>
  );
}
