import Link from "next/link";
import type { ShowcaseProject } from "@/lib/data";
import { Section } from "./Section";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  items: ShowcaseProject[];
};

export function ShowcaseGrid({ id, eyebrow, title, items }: Props) {
  return (
    <Section id={id} eyebrow={eyebrow} title={title}>
      <div className="space-y-4">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className="group block rounded-lg border border-border bg-card p-6 hover:border-foreground/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                  {p.role}
                </p>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-muted transition-colors">
                  {p.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {p.status === "live" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                )}
                <span
                  aria-hidden
                  className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all"
                >
                  →
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-[15px] text-muted leading-relaxed">
              {p.summary}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="text-[11px] font-mono text-muted border border-border rounded px-2 py-0.5"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </Section>
  );
}
