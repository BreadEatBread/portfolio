"use client";

const KEY = "portfolio:scroll-to";

export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (id === "top" || id === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  scrollToId("top");
}

/**
 * Anchor 링크(`#foo` 또는 `/#foo`) 를 URL 을 더럽히지 않고 처리.
 * - 홈이면 바로 스크롤
 * - 다른 페이지면 sessionStorage 에 타깃을 남기고 홈으로 이동
 */
export function jumpToHomeSection(
  href: string,
  navigate: (path: string) => void,
) {
  if (typeof window === "undefined") return;
  const id = href.replace(/^\/?/, "").replace(/^#/, "");
  if (window.location.pathname === "/") {
    scrollToId(id || "top");
    return;
  }
  try {
    sessionStorage.setItem(KEY, id);
  } catch {
    // ignore quota errors
  }
  navigate("/");
}

/** 홈 페이지 진입 직후 sessionStorage 신호를 소비. */
export function consumePendingScrollTarget(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const id = sessionStorage.getItem(KEY);
    if (id) sessionStorage.removeItem(KEY);
    return id;
  } catch {
    return null;
  }
}
