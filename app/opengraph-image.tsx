import { ImageResponse } from "next/og";

export const alt = "김정웅 · Full-Stack Developer";
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
          padding: 80,
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "Pretendard",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "1px solid rgba(237,237,237,0.15)",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 1,
              color: "#ededed",
              fontFamily: "monospace",
            }}
          >
            JW
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              fontFamily: "monospace",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Portfolio · 3년차
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              color: "#ededed",
            }}
          >
            <div style={{ fontSize: 148, fontWeight: 700, lineHeight: 1 }}>
              김정웅
            </div>
            <div
              style={{
                fontSize: 32,
                color: "#71717a",
                fontFamily: "monospace",
              }}
            >
              Jungwoong Kim
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 40, color: "#ededed", fontWeight: 600 }}>
              Full-Stack Developer
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 28,
                color: "#a1a1aa",
                lineHeight: 1.4,
              }}
            >
              <span>프론트엔드와 백엔드, IoT 장비 연동까지.</span>
              <span>제품 전반을 넓게 다룹니다.</span>
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
          <div
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            woong4252.vercel.app
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              color: "#a1a1aa",
              fontFamily: "monospace",
              letterSpacing: 1.5,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#34d399",
              }}
            />
            <span>LIVE</span>
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
