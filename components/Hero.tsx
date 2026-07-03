import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[92vh] flex items-center px-6 pt-24 pb-16"
    >
      <div className="mx-auto max-w-5xl w-full">
        <div className="animate-fade-up">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
            Portfolio · {profile.years}
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            안녕하세요,
            <br />
            <span className="text-muted">저는 </span>
            {profile.name}
            <span className="text-foreground">입니다.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
            {profile.tagline}
          </p>
          <div className="mt-12 flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 h-11 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get in touch
              <span aria-hidden>→</span>
            </a>
            <a
              href="#experience"
              className="inline-flex items-center rounded-full border border-border px-5 h-11 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              경력 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
