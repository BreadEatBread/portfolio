import { ImageResponse } from "next/og";

export const alt = "이벤트 버스 리팩토링 — 36개 화면을 한 줄 선언으로";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const REGULAR =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Regular.ttf";
const BOLD =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Bold.ttf";

async function fontBytes(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`font fetch failed: ${url}`);
  return await res.arrayBuffer();
}

export default async function OG() {
  const [regular, bold] = await Promise.all([
    fontBytes(REGULAR),
    fontBytes(BOLD),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, color: "#a1a1aa", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>
            Case Study · Frontend Architecture
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 10,
              border: "1px solid rgba(237,237,237,0.15)",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 1,
              fontFamily: "monospace",
            }}
          >
            JW
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
            탭 사이에 흐르는 이벤트 버스
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 24,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            <span>36개 화면을 한 줄 선언으로 옮긴 리팩토링</span>
            <span>SaaS MES · 서울소프트 (2026)</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 22px",
              borderRadius: 8,
              border: "1px solid rgba(237,237,237,0.2)",
              fontFamily: "monospace",
              fontSize: 20,
              color: "#ededed",
            }}
          >
            Tab A · mutate
          </div>
          <span style={{ color: "#a1a1aa", fontFamily: "monospace", fontSize: 20 }}>→</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 22px",
              borderRadius: 8,
              border: "1px solid rgba(52,211,153,0.4)",
              background: "rgba(52,211,153,0.1)",
              fontFamily: "monospace",
              fontSize: 20,
              color: "#6ee7b7",
            }}
          >
            bus.emit(...)
          </div>
          <span style={{ color: "#a1a1aa", fontFamily: "monospace", fontSize: 20 }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 18px",
                borderRadius: 8,
                border: "1px solid rgba(167,139,250,0.4)",
                background: "rgba(167,139,250,0.1)",
                fontFamily: "monospace",
                fontSize: 16,
                color: "#c4b5fd",
              }}
            >
              Tab B · reload()
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 18px",
                borderRadius: 8,
                border: "1px solid rgba(167,139,250,0.4)",
                background: "rgba(167,139,250,0.1)",
                fontFamily: "monospace",
                fontSize: 16,
                color: "#c4b5fd",
              }}
            >
              Tab C · reload()
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            borderTop: "1px solid rgba(237,237,237,0.1)",
          }}
        >
          <div style={{ fontSize: 22, color: "#a1a1aa", fontFamily: "monospace" }}>
            woong4252.vercel.app/projects/event-bus-refactor
          </div>
          <div style={{ fontSize: 22, color: "#a1a1aa", fontFamily: "monospace" }}>
            김정웅 · Portfolio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
