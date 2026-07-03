import { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="px-6 py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 md:grid-cols-[220px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
              {eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
