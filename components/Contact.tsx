import { profile } from "@/lib/data";
import { Section } from "./Section";

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  ...(profile.github
    ? [
        {
          label: "GitHub",
          value: stripProtocol(profile.github),
          href: profile.github,
        },
      ]
    : []),
  ...(profile.linkedin
    ? [
        {
          label: "LinkedIn",
          value: stripProtocol(profile.linkedin),
          href: profile.linkedin,
        },
      ]
    : []),
];

export function Contact() {
  return (
    <Section id="contact" eyebrow="05 · Contact" title="연락하기">
      <div className="space-y-6">
        <p className="text-base sm:text-lg leading-relaxed text-muted">
          함께 만들고 싶은 제품이 있거나, 그냥 커피 한 잔 하고 싶으시다면
          <br className="hidden sm:block" />
          언제든 메일 주세요.
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="group flex items-center justify-between py-5 text-foreground hover:text-muted transition-colors"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {link.label}
                </span>
                <span className="flex items-center gap-3 text-base">
                  {link.value}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
