import { experiences } from "@/lib/data";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="05 · Experience" title="경력 사항">
      <ol className="relative border-l border-border pl-8 space-y-16">
        {experiences.map((exp, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[37px] top-2 w-2.5 h-2.5 rounded-full bg-foreground ring-4 ring-background" />

            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
              {exp.period}
            </p>
            <h3 className="text-xl font-semibold text-foreground">
              {exp.company}
            </h3>
            <p className="mt-1 text-sm text-muted">{exp.role}</p>
            {exp.summary && (
              <p className="mt-4 text-muted leading-relaxed">{exp.summary}</p>
            )}

            <div className="mt-8 space-y-10">
              {exp.projects.map((project, j) => (
                <div
                  key={j}
                  className="relative pl-5 border-l border-border/60"
                >
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h4 className="text-base font-medium text-foreground">
                      {project.name}
                    </h4>
                    {project.period && (
                      <p className="font-mono text-[11px] text-muted whitespace-nowrap">
                        {project.period}
                      </p>
                    )}
                  </div>
                  <ul className="mt-3 space-y-2 text-sm sm:text-[15px] text-muted leading-relaxed">
                    {project.points.map((point, k) => (
                      <li key={k} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 shrink-0 w-1 h-1 rounded-full bg-muted"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {project.stack && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.stack.map((s) => (
                        <li
                          key={s}
                          className="text-[11px] font-mono text-muted border border-border rounded px-2 py-0.5"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
