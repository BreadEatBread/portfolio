"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/lib/data";

type Command = {
  id: string;
  title: string;
  hint?: string;
  category: string;
  keywords?: string;
  action: () => void | Promise<void>;
};

const OPEN_EVENT = "portfolio:open-command-palette";

function isEditableTarget(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  return t.isContentEditable;
}

function matches(cmd: Command, q: string): boolean {
  if (!q) return true;
  const haystack = (
    cmd.title +
    " " +
    (cmd.hint ?? "") +
    " " +
    (cmd.keywords ?? "") +
    " " +
    cmd.category
  ).toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const go = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const flashToast = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1400);
  }, []);

  const commands = useMemo<Command[]>(() => {
    return [
      // Navigation
      { id: "nav-home", title: "홈으로", category: "이동", keywords: "top home about",
        action: () => go("/") },
      { id: "nav-about", title: "About · 개발자 김정웅", category: "이동", keywords: "소개 자기소개 introduction",
        action: () => go("/#about") },
      { id: "nav-skills", title: "Skills · 사용하는 도구", category: "이동", keywords: "스킬 스택 기술",
        action: () => go("/#skills") },
      { id: "nav-projects", title: "Projects · 프로젝트", category: "이동", keywords: "프로젝트",
        action: () => go("/#projects") },
      { id: "nav-cases", title: "Case Studies · 케이스 스터디", category: "이동", keywords: "케이스 스터디 case study",
        action: () => go("/#case-studies") },
      { id: "nav-experience", title: "Experience · 경력 사항", category: "이동", keywords: "경력 career",
        action: () => go("/#experience") },
      { id: "nav-contact", title: "Contact · 연락하기", category: "이동", keywords: "연락처 이메일 contact",
        action: () => go("/#contact") },

      // Projects
      { id: "p-factory", title: "Factory Live", hint: "IoT 실시간 대시보드 · Server SSE + Client",
        category: "프로젝트", keywords: "iot 공장 대시보드 sse 실시간 modbus esp32",
        action: () => go("/projects/iot-dashboard") },
      { id: "p-grid", title: "Enterprise Grid", hint: "10만 로우 데이터 테이블 · 가상 스크롤",
        category: "프로젝트", keywords: "그리드 테이블 데이터 slickgrid extjs virtual scroll",
        action: () => go("/projects/enterprise-grid") },
      { id: "p-modbus", title: "Modbus Playground", hint: "프레임 조립·파싱·CRC-16 도구",
        category: "프로젝트", keywords: "modbus rtu crc frame playground",
        action: () => go("/projects/modbus-playground") },

      // Case studies
      { id: "cs-eventbus", title: "이벤트 버스 리팩토링",
        hint: "36개 화면을 한 줄 선언으로 · 서울소프트",
        category: "케이스 스터디", keywords: "event bus pubsub iframe ajaxsuccess 이벤트버스",
        action: () => go("/projects/event-bus-refactor") },
      { id: "cs-kukudocs", title: "iframe 웹 에디터 저장 흐름",
        hint: "postMessage · FORCE_COMMIT · 굿스트림",
        category: "케이스 스터디", keywords: "kukudocs iframe postmessage editor",
        action: () => go("/projects/kukudocs-iframe") },

      // Actions
      {
        id: "act-email",
        title: "이메일 복사",
        hint: profile.email,
        category: "액션",
        keywords: "email mail copy 클립보드",
        action: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            flashToast(`복사됨 · ${profile.email}`);
          } catch {
            flashToast("복사 실패");
          }
        },
      },
      {
        id: "act-github",
        title: "GitHub 저장소 열기",
        hint: "이 사이트의 소스",
        category: "액션",
        keywords: "github repo source 소스",
        action: () => {
          if (profile.github) window.open(profile.github, "_blank", "noopener");
        },
      },
    ];
  }, [go, flashToast]);

  const filtered = useMemo(
    () => commands.filter((c) => matches(c, query)),
    [commands, query],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of filtered) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Global open/close listeners
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }
      // Slash key opens palette when not typing in an input
      if (e.key === "/" && !open && !isEditableTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onExternalOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onExternalOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onExternalOpen);
    };
  }, [open]);

  // Focus management + reset when opening
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setSelectedIdx(0);
      window.setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep selectedIdx in range
  useEffect(() => {
    if (selectedIdx >= filtered.length) setSelectedIdx(0);
  }, [filtered.length, selectedIdx]);

  const runSelected = useCallback(() => {
    const cmd = filtered[selectedIdx];
    if (!cmd) return;
    void cmd.action();
    if (cmd.category !== "액션") setOpen(false);
  }, [filtered, selectedIdx]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSelected();
    } else if (e.key === "Home") {
      e.preventDefault();
      setSelectedIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSelectedIdx(Math.max(0, filtered.length - 1));
    }
  };

  if (!open) {
    return (
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]"
      >
        {toast && (
          <div className="rounded-full border border-border bg-card px-4 py-2 text-xs font-mono text-foreground shadow-lg">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="커맨드 팔레트"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="팔레트 닫기"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span aria-hidden className="font-mono text-[11px] text-muted">
            ⌘K
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={onInputKeyDown}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="어디로 갈까요? (섹션·프로젝트·액션 검색)"
            className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
            esc
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              결과 없음 — 다른 단어로 검색해보세요.
            </p>
          ) : (
            grouped.map(([category, cmds]) => (
              <div key={category} className="mb-1 last:mb-0">
                <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {category}
                </p>
                <ul>
                  {cmds.map((cmd) => {
                    const idx = filtered.indexOf(cmd);
                    const active = idx === selectedIdx;
                    return (
                      <li key={cmd.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIdx(idx);
                            void cmd.action();
                            if (cmd.category !== "액션") setOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIdx(idx)}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                            active
                              ? "bg-foreground/[0.08]"
                              : "hover:bg-foreground/[0.04]"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`h-1 w-1 rounded-full ${
                              active ? "bg-foreground" : "bg-transparent"
                            }`}
                          />
                          <span className="flex-1 min-w-0">
                            <span
                              className={`block text-sm truncate ${
                                active ? "text-foreground" : "text-foreground/90"
                              }`}
                            >
                              {cmd.title}
                            </span>
                            {cmd.hint && (
                              <span className="block text-xs text-muted truncate">
                                {cmd.hint}
                              </span>
                            )}
                          </span>
                          {active && (
                            <kbd className="hidden sm:inline-block font-mono text-[10px] text-muted">
                              ↵
                            </kbd>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border px-4 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↑</kbd>
            <kbd className="rounded border border-border px-1">↓</kbd>
            이동
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">↵</kbd>
            실행
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border px-1">esc</kbd>
            닫기
          </span>
          <span className="ml-auto">{filtered.length} 항목</span>
        </div>
      </div>
    </div>
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
