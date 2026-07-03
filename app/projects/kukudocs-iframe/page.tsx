import type { Metadata } from "next";
import {
  BulletList,
  CaseStudyBlock,
  CaseStudyLayout,
  TradeoffCard,
} from "@/components/case-study/Layout";
import { KukudocsFlow } from "@/components/case-study/KukudocsFlow";

export const metadata: Metadata = {
  title: "Kukudocs Editor iframe 저장 흐름 · 김정웅",
  description:
    "부모 창의 저장 버튼과 iframe 안 웹 에디터의 편집 상태를 안전하게 이어붙인 이야기. FORCE_COMMIT 메시지 계약과 postMessage 왕복 설계.",
};

export default function KukudocsIframePage() {
  return (
    <CaseStudyLayout
      eyebrow="Case Study · Frontend Integration"
      title="iframe 안의 편집기와 밖의 저장 버튼을 잇는 법"
      subtitle="Kukudocs Editor + WeSM · 굿스트림 (2024)"
      description="굿스트림 재직 중 진행한 React 기반 엔터프라이즈 시스템에 3rd-party 웹 에디터를 iframe 으로 통합했을 때, 편집 상태를 잃지 않고 저장하기 위해 만든 postMessage 프로토콜과 실패 경로 설계에 대한 정리."
    >
      <CaseStudyBlock eyebrow="01 · Problem" title="편집 상태가 iframe 안에 갇힌다">
        <p>
          문서 편집기는 <span className="text-foreground">Kukudocs Editor</span>
          , 그것을 감싸는 앱은 우리가 만든 React SPA (WeSM). 에디터는{" "}
          <strong className="text-foreground font-medium">iframe 으로 임베드</strong>
          되고, 우리 화면에는 우리가 만든 저장 버튼이 있다.
        </p>
        <p>
          문제는 사용자가 편집기 안에서 타이핑을 마쳐도{" "}
          <strong className="text-foreground font-medium">
            그 최신 상태가 아직 커밋되지 않은 순간
          </strong>
          이 있다는 것. IME 조합 중 이거나, 자동저장 debounce 대기 중이거나. 이
          상태에서 부모의 저장을 눌러 서버로 전송하면 <em>바로 직전</em> 문서가
          저장되고, 방금 친 글자는 사라진다.
        </p>
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="02 · Constraints" title="손댈 수 없는 것들">
        <BulletList
          items={[
            "Kukudocs는 3rd-party 제품 — 내부 구현을 뜯어고칠 수 없다.",
            "iframe 은 대개 다른 origin — 부모가 iframe DOM 을 직접 만질 수 없다 (cross-origin).",
            "저장 버튼은 우리 UI 안에 있어야 한다 — 편집기 안의 저장 버튼에 의존하면 UX 가 두 갈래로 갈라짐.",
            "네트워크·타이머 지연을 상정해야 한다 — 사용자가 저장 눌렀는데 5초 안 반응 없으면 무언가 잘못된 것.",
          ]}
        />
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="03 · Approach" title="메시지 계약을 정의한다">
        <p>
          부모와 iframe 이 서로 <strong className="text-foreground font-medium">
          postMessage
          </strong>{" "}
          로만 대화할 수 있으니, 결국{" "}
          <strong className="text-foreground font-medium">
            "저장"이라는 동사를 계약으로 정의
          </strong>
          하는 문제가 된다.
        </p>

        <KukudocsFlow />

        <p>
          부모가 저장 눌렀을 때 실제로 벌어지는 일:
        </p>
        <BulletList
          items={[
            "부모가 iframe에 postMessage({ type: FORCE_COMMIT, nonce })를 보낸다. nonce 는 요청·응답 매칭용 랜덤 문자열.",
            "iframe(Kukudocs)이 내부 버퍼를 강제 커밋한 뒤 postMessage({ type: COMMITTED, nonce, html })로 응답한다.",
            "부모가 자신이 방금 보낸 nonce 와 일치하는 응답만 받아들이고, 응답의 html 을 우리 서버로 fetch(POST /api/documents/{id}) 저장한다.",
            "5초 안에 응답이 없으면 부모는 저장 실패로 판단해 사용자에게 알린다 (재시도 or 문서 창 유지).",
          ]}
        />
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="04 · Tradeoffs" title="설계 결정과 트레이드오프">
        <div className="space-y-6">
          <TradeoffCard
            decision="저장 버튼은 부모 UI 에만 둔다 (iframe 내부 버튼 숨김)"
            pro="사용자에게 저장이 하나의 명확한 진입점. UX 일관성. 감사 로그도 부모에서만 남김."
            con="Kukudocs 자체 저장 훅을 우회해야 함. 매 버전 업그레이드마다 커밋 API 가 유지되는지 확인 필요."
          />
          <TradeoffCard
            decision="비동기 응답을 기다린다 (fire-and-forget X)"
            pro="'저장했는데 최신 문자가 빠졌다' 유형 버그가 원천적으로 사라짐. 실패 시 사용자에게 되돌릴 기회."
            con="postMessage 왕복 + 서버 저장까지 500ms 이상 걸릴 수 있음. 저장 버튼을 스피너로 잠가야 하는 UX."
          />
          <TradeoffCard
            decision="nonce 로 요청·응답을 매칭한다"
            pro="여러 저장이 동시에 걸려도 서로 섞이지 않음. iframe 이 예전 nonce 로 응답하면 조용히 버림."
            con="구현 복잡도 소폭 증가. 랜덤 문자열 생성·저장 구조가 필요."
          />
        </div>
      </CaseStudyBlock>

      <CaseStudyBlock eyebrow="05 · Learnings" title="다시 하게 된다면">
        <ul className="space-y-3 list-none">
          {[
            {
              k: "iframe 통합 = API 계약을 먼저 문서화한다.",
              v: "postMessage 스키마(type, payload, nonce, timeout) 를 코드 짜기 전에 표로 정리해두니 이후의 실패 케이스 처리와 로그 남기기가 자연스러워졌다. '메시지 이름부터 정의' 는 다음 3rd-party 통합에서도 그대로 유지.",
            },
            {
              k: "IME 조합·debounce 를 잊지 않는다.",
              v: "한글 입력은 조합 중 상태가 별도 이벤트로 존재한다. 자동저장이 붙어있는 에디터는 대부분 debounce/throttle 이 들어가 있어 '방금 친 문자가 어디에 있냐' 를 항상 의심해야 한다.",
            },
            {
              k: "실패 경로를 UI 로 표현한다.",
              v: "5초 안에 응답 못 온 케이스를 앱 안에서 만나본 뒤에야, 사용자에게 문서를 어떻게 살릴지 알려주는 UI 를 설계할 수 있었다. 성공 경로만 만드는 습관을 되짚게 된 계기.",
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
