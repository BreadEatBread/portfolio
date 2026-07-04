import type { Metadata } from "next";
import { BackToPortfolioLink } from "@/components/BackToPortfolioLink";
import { RateLimitCaseStudy } from "@/components/ratelimit/CaseStudy";
import { Sandbox } from "@/components/ratelimit/Sandbox";

export const metadata: Metadata = {
  title: "Rate Limit Sandbox · 김정웅",
  description:
    "Fixed Window · Sliding Window · Token Bucket 세 가지 rate limit 알고리즘을 하나의 서버 위에 얹고 눈으로 굴려보는 도구. Edge Runtime + 표준 429 응답 헤더.",
};

export default function RateLimitPage() {
  return (
    <main id="main" className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-3">
          <BackToPortfolioLink />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Tool · Backend
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Rate Limit Sandbox
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            서버 위에서 실제로 돌아가는 세 가지 rate limit 알고리즘(Fixed
            Window · Sliding Window · Token Bucket) 을 눈으로 굴려보는 도구.
            버튼을 눌러 요청을 보내면 서버가 알고리즘을 통해 허용/거부(429)를
            결정하고, 응답에 표준 헤더(Retry-After · X-RateLimit-Remaining) 를
            실어 보냅니다.
          </p>
        </header>

        <Sandbox />

        <RateLimitCaseStudy />
      </div>
    </main>
  );
}
