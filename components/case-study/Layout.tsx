import type { ReactNode } from "react";
import { BackToPortfolioLink } from "@/components/BackToPortfolioLink";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  children: ReactNode;
};

export function CaseStudyLayout({
  eyebrow,
  title,
  subtitle,
  description,
  children,
}: Props) {
  return (
    <main id="main" className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-3">
          <BackToPortfolioLink />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-muted">{subtitle}</p>
          )}
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            {description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}

type BlockProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function CaseStudyBlock({ eyebrow, title, children }: BlockProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-[180px_1fr]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
            {eyebrow}
          </p>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
        <div className="space-y-4 text-muted leading-relaxed min-w-0">
          {children}
        </div>
      </div>
    </section>
  );
}

type TradeoffProps = {
  decision: string;
  pro: string;
  con: string;
};

export function TradeoffCard({ decision, pro, con }: TradeoffProps) {
  return (
    <div className="rounded border border-border/60 p-4">
      <p className="text-foreground font-medium mb-3">{decision}</p>
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1">
            얻은 것
          </p>
          <p className="text-muted">{pro}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
            놓은 것
          </p>
          <p className="text-muted">{con}</p>
        </div>
      </div>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 list-none">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden
            className="mt-2 h-1 w-1 rounded-full bg-muted shrink-0"
          />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
