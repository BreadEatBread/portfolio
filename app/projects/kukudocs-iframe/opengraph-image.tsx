import { ImageResponse } from "next/og";

export const alt = "iframe 웹 에디터 저장 흐름 — postMessage 계약 설계";
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
            Case Study · Frontend Integration
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
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
            iframe 안의 편집기와 밖의 저장 버튼을 잇는 법
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
            <span>FORCE_COMMIT 메시지 계약과 postMessage 왕복 설계</span>
            <span>Kukudocs Editor + WeSM · 굿스트림 (2024)</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 20px",
              borderRadius: 8,
              border: "1px solid rgba(237,237,237,0.2)",
              fontFamily: "monospace",
              fontSize: 22,
              color: "#ededed",
            }}
          >
            Parent
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: "#a1a1aa",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            <span>postMessage(FORCE_COMMIT) →</span>
            <span>← postMessage(COMMITTED)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 20px",
              borderRadius: 8,
              border: "1px solid rgba(167,139,250,0.4)",
              background: "rgba(167,139,250,0.1)",
              fontFamily: "monospace",
              fontSize: 22,
              color: "#c4b5fd",
            }}
          >
            iframe
          </div>
          <div
            style={{
              marginLeft: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: "#a1a1aa",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            <span>→ fetch(save)</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 20px",
              borderRadius: 8,
              border: "1px solid rgba(52,211,153,0.4)",
              background: "rgba(52,211,153,0.1)",
              fontFamily: "monospace",
              fontSize: 22,
              color: "#6ee7b7",
            }}
          >
            API
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
            woong4252.vercel.app/projects/kukudocs-iframe
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
