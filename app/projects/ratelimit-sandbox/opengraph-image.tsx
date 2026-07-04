import { ImageResponse } from "next/og";

export const alt = "Rate Limit Sandbox — Fixed / Sliding / Token Bucket 실물 비교";
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

// Deterministic mix of accepted/rejected to visualize a burst hitting the limit
const timeline: boolean[] = [
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, false, true, true, false, false, true, false,
  false, false, true, true, false,
];

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
            Tool · Backend
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>
            Rate Limit Sandbox
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontFamily: "monospace", fontSize: 18, color: "#a1a1aa" }}>
            {["Fixed Window", "Sliding Window", "Token Bucket"].map((n) => (
              <span
                key={n}
                style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(237,237,237,0.15)" }}
              >
                {n}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa", lineHeight: 1.4 }}>
            Edge Runtime 위에서 세 알고리즘을 눈으로 굴려보는 도구.
          </div>
        </div>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
            {timeline.map((accepted, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: accepted ? 60 + (i % 5) * 6 : 30 + (i % 5) * 4,
                  borderRadius: 4,
                  background: accepted ? "#34d399" : "#fb7185",
                  opacity: 0.7 + (i / timeline.length) * 0.3,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, fontFamily: "monospace", fontSize: 14, color: "#a1a1aa" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#34d399" }} />
              200 OK
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#fb7185" }} />
              429 Retry-After
            </span>
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
            woong4252.vercel.app/projects/ratelimit-sandbox
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
