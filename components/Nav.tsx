import Link from "next/link";
import { nav, profile } from "@/lib/data";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Link
          href="#top"
          className="text-sm font-medium tracking-tight text-foreground hover:text-muted transition-colors"
        >
          {profile.name}
          <span className="text-muted ml-2 font-mono text-xs">
            /{profile.nameEn}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
