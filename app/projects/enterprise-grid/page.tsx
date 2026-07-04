import type { Metadata } from "next";
import { BackToPortfolioLink } from "@/components/BackToPortfolioLink";
import { EnterpriseGridCaseStudy } from "@/components/enterprise-grid/CaseStudy";
import { Grid } from "@/components/enterprise-grid/Grid";

export const metadata: Metadata = {
  title: "Enterprise Grid · 김정웅",
  description:
    "라이브러리 없이 React 만으로 만든 10만 로우 데이터 테이블. 가상 스크롤 · 정렬 · 필터 · 다중 선택 · CSV 내보내기 · 데스크탑급 키보드 네비.",
};

export default function EnterpriseGridPage() {
  return (
    <main id="main" className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-3">
          <BackToPortfolioLink />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Tool · Enterprise UI
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Enterprise Grid
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            라이브러리 없이 React 만으로 10만 로우를 부드럽게 스크롤·정렬·필터·선택·내보내는
            그리드. Ext JS/SlickGrid 로 몇 년을 다뤄본 데이터 heavy UI 감각을,
            현대 React 스택에서 얼마까지 가져올 수 있는지 실험한 도구입니다.
          </p>
        </header>

        <Grid />

        <EnterpriseGridCaseStudy />
      </div>
    </main>
  );
}
