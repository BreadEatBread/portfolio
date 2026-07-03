import { profile } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border px-6 py-10 mt-auto">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-muted">
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>
        <p>Built with Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
