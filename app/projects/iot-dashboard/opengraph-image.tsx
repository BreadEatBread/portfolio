import { ImageResponse } from "next/og";

export const alt = "Factory Live — IoT 실시간 대시보드";
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

const barHeights = [
  22, 34, 48, 62, 78, 92, 84, 66, 52, 38, 28, 44, 60, 82, 96, 88, 72, 56, 40, 28,
  30, 46, 64, 80, 92, 86, 70, 52, 36, 24,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              fontFamily: "monospace",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Case Study · IoT Realtime
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
          <div style={{ fontSize: 128, fontWeight: 700, lineHeight: 1 }}>
            Factory Live
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              color: "#a1a1aa",
              fontFamily: "monospace",
              fontSize: 18,
            }}
          >
            {["냉동고", "금속검출기", "충진기", "밀링머신", "라인 컨트롤러"].map(
              (n) => (
                <span
                  key={n}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(237,237,237,0.15)",
                  }}
                >
                  {n}
                </span>
              ),
            )}
          </div>
          <div style={{ fontSize: 26, color: "#a1a1aa", lineHeight: 1.4 }}>
            공장 설비 5대의 상태·전력·온도·진동을 실시간으로 스트리밍하는
            인터랙티브 데모.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 100,
          }}
        >
          {barHeights.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: h,
                borderRadius: 2,
                background:
                  i > 22 ? "#34d399" : "rgba(237,237,237,0.55)",
                opacity: 0.55 + (h / 100) * 0.45,
              }}
            />
          ))}
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
            woong4252.vercel.app/projects/iot-dashboard
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
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
