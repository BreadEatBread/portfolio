import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex-1 min-h-[80vh] flex items-center justify-center px-6"
    >
      <div className="mx-auto max-w-lg w-full text-center space-y-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Error · 404
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-none">
          404
          <span className="block text-lg sm:text-xl text-muted mt-3">
            해당 페이지를 찾을 수 없습니다.
          </span>
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          주소가 잘못 입력됐거나, 있던 페이지가 자리를 옮겼을 수 있어요.
          아래에서 이어서 둘러보세요.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 h-10 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            홈으로
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center rounded-full border border-border px-5 h-10 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            프로젝트 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
