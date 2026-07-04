import Link from "next/link";
import { profile } from "@/lib/data";

const pageLinks: { href: string; label: string; external?: boolean }[] = [
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
  { href: "/projects/iot-dashboard", label: "Factory Live" },
  { href: "/projects/enterprise-grid", label: "Enterprise Grid" },
  { href: "/projects/ratelimit-sandbox", label: "Rate Limit" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const social: { href: string; label: string }[] = [
    { href: `mailto:${profile.email}`, label: "Email" },
  ];
  if (profile.github) social.push({ href: profile.github, label: "GitHub" });
  if (profile.linkedin) social.push({ href: profile.linkedin, label: "LinkedIn" });

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              About
            </p>
            <p className="text-sm text-foreground">
              {profile.name}
              <span className="text-muted ml-2 font-mono text-xs">
                /{profile.nameEn}
              </span>
            </p>
            <p className="text-xs text-muted leading-relaxed">
              {profile.role} · {profile.location}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              둘러보기
            </p>
            <ul className="space-y-1.5">
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Elsewhere
            </p>
            <ul className="space-y-1.5">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-border text-xs font-mono text-muted">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
