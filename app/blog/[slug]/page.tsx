import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPost(slug);
  if (!entry) return { title: "글을 찾을 수 없습니다" };
  const { meta } = entry;
  return {
    title: `${meta.title} · 김정웅`,
    description: meta.description,
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const entry = getPost(slug);
  if (!entry) notFound();
  const { meta, Component } = entry;

  return (
    <main id="main" className="flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <span aria-hidden>←</span> 모든 글
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {meta.date} · {meta.readingTimeMin}분 읽기 · {meta.tags.join(" · ")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight">
            {meta.title}
          </h1>
          <p className="text-base text-muted leading-relaxed">
            {meta.description}
          </p>
        </header>

        <Component />

        <footer className="border-t border-border pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <span aria-hidden>←</span> 다른 글도 보기
          </Link>
        </footer>
      </div>
    </main>
  );
}
