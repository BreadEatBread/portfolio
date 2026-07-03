import {
  BulletList,
  CaseStudyBlock,
  TradeoffCard,
} from "@/components/case-study/Layout";

export function EnterpriseGridCaseStudy() {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          Case Study
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          만들면서 고민한 것들
        </h2>
      </div>

      <div className="space-y-4">
        <CaseStudyBlock eyebrow="01 · Problem" title="10만 로우가 부드럽게 흐르려면">
          <p>
            Ext JS·SlickGrid 로 관리해온 엔터프라이즈 화면은 기본적으로{" "}
            <strong className="text-foreground font-medium">
              큰 데이터 × 조밀한 조작
            </strong>{" "}
            의 조합이다. 페이지 나눔 없이 목록 전체를 스크롤로 훑고 싶어하는
            현업, 마우스에서 손을 떼기 싫어하는 파워 유저.
          </p>
          <p>
            "React 로도 이 정도 UX 가 나오나?" 라는 질문을 스스로에게
            던져보고 싶었다. 라이브러리 없이 얼마까지 갈 수 있는지 확인하는
            연습.
          </p>
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="02 · Approach" title="구조 요약">
          <BulletList
            items={[
              "결정적 PRNG(LCG) 시드로 10만 로우를 그때그때 생성. 페이지 리로드해도 데이터 동일 → 링크 공유해도 같은 데이터를 봄.",
              "가상 스크롤은 React 만으로 직접. 스크롤 top → visible index 범위 → 상단·하단 spacer div 로 컨테이너 높이 유지.",
              "정렬은 filtered 결과 위에서 클라이언트-사이드 sort. 10만 건 sort ~ 30ms → useMemo 로 캐시.",
              "선택 상태는 Set<number>. 클릭·Shift-Range·⌘/Ctrl-Toggle 세 가지 패턴을 하나의 onRowClick 이 처리.",
              "키보드 네비 — 그리드에 tabIndex, ArrowUp/Down · PageUp/Down · Home/End · Space 를 처리하고 focus 위치가 뷰포트 밖이면 자동 scrollTo.",
              "CSV 내보내기는 선택이 있으면 선택 row, 없으면 필터된 전체. BOM 붙여서 엑셀 한글 깨짐 방지.",
            ]}
          />
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="03 · Tradeoffs" title="설계 결정과 트레이드오프">
          <div className="space-y-6">
            <TradeoffCard
              decision="라이브러리 없이 처음부터 구현"
              pro="번들 사이즈 작고, 렌더링 경로가 짧아 예측 가능. 세부 UX(포커스 링, 키보드 흐름) 를 원하는 대로 만짐."
              con="열 리사이즈·재정렬·인라인 편집 같은 큰 기능은 여전히 각자 구현 부담. 프로덕션에는 결국 ag-grid 같은 걸 쓰게 될 수 있음."
            />
            <TradeoffCard
              decision="가상 스크롤 offset 을 spacer div 로"
              pro="구현이 단순하고 transform 재계산이 없어 스크롤이 부드러움. 브라우저 스크롤 UX 그대로 유지."
              con="총 높이가 커지면 (수백만 행) 브라우저 max-scroll 한계에 부딪힘. 그때는 window(scroll offset) 를 잘라 재매핑 필요."
            />
            <TradeoffCard
              decision="정렬·필터는 클라이언트 사이드"
              pro="네트워크 왕복 없이 즉시 반응. 데모 목적에도 부합."
              con="실전에서 100만 행 넘어가면 서버 페이지네이션 + 서버 정렬로 옮겨야 함. 이 데모의 다음 단계."
            />
            <TradeoffCard
              decision="선택 상태는 Set<number> 하나"
              pro="선택 여부 판정이 O(1). 여러 선택 패턴을 한 상태에서 표현."
              con="Set 을 useState 로 관리하면 새 Set 을 매번 만들어야 하는 React 관습이 있음. 한 번 익숙해지면 문제 없음."
            />
          </div>
        </CaseStudyBlock>

        <CaseStudyBlock eyebrow="04 · Learnings" title="가져가는 것">
          <ul className="space-y-3 list-none">
            {[
              {
                k: "React 도 라이브러리 없이 10만 로우가 부드럽게 흐른다.",
                v: "체감상 SlickGrid 와 큰 차이 없다. 관건은 프레임워크가 아니라 렌더링 경로를 얼마나 짧게 잘라두느냐. useMemo·정확한 슬라이싱·spacer div 세 개면 대부분 문제가 사라진다.",
              },
              {
                k: "키보드 네비는 「포커스가 뷰포트 밖으로 나가지 않게」 가 전부다.",
                v: "ArrowDown 자체는 쉽다. 어려운 건 focus 인덱스가 렌더 범위 밖일 때 자연스럽게 scrollTop 을 밀어주는 것. 이 한 줄이 없으면 데스크탑 앱 느낌이 안 남.",
              },
              {
                k: "CSV BOM 하나가 협업 마찰을 크게 줄인다.",
                v: "엑셀에서 UTF-8 CSV 를 열면 한글이 깨지는 게 국룰. 파일 앞에 BOM(\\uFEFF) 만 붙이면 해결. 이력서 파일 이름에 '한글깨짐' 을 넣어두지 말자.",
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
