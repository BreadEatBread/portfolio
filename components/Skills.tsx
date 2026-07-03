import { skills } from "@/lib/data";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="02 · Skills" title="사용하는 도구">
      <div className="grid gap-10 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-medium text-foreground mb-4">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-xs font-mono text-muted border border-border rounded-full px-3 py-1.5 hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
