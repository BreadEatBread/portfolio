import { profile } from "@/lib/data";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" eyebrow="01 · About" title="개발자 김정웅">
      <div className="space-y-5 text-base sm:text-lg leading-relaxed text-muted">
        {profile.intro.map((p, i) => (
          <p key={i} className={i === 0 ? "text-foreground" : undefined}>
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
