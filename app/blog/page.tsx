import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog · 김정웅",
  description:
    "실무에서 마주친 문제와 배운 것들을 짧게 정리. 산업 IoT · 프론트엔드 아키텍처 · React 최적화 등.",
};

export default function BlogIndexPage() {
  const posts = listPosts();

  return (
    <main id="main" className="flex-1 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-12">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <span aria-hidden>←</span> 포트폴리오로
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            글
          </h1>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            실무에서 마주친 문제, 만들면서 배운 것, 스스로 정리해두고 싶었던
            개념들. 자주 쌓이진 않지만 하나 하나는 최소한만 남긴다.
          </p>
        </header>

        <ul className="space-y-4">
          {posts.length === 0 && (
            <li className="text-sm text-muted text-center py-16">
              아직 글이 없습니다.
            </li>
          )}
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-border bg-card p-6 hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {p.date} · {p.readingTimeMin}분 읽기
                  </p>
                  <p className="font-mono text-[10px] text-muted">
                    {p.tags.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-muted transition-colors">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
