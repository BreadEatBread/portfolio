import { ImageResponse } from "next/og";

export const alt = "Modbus Playground — 요청 프레임 조립/파싱 도구";
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

const frameBytes: { value: string; role: string }[] = [
  { value: "01", role: "slave" },
  { value: "03", role: "function" },
  { value: "00", role: "address" },
  { value: "00", role: "address" },
  { value: "00", role: "count" },
  { value: "02", role: "count" },
  { value: "C4", role: "crc" },
  { value: "0B", role: "crc" },
];

const colors: Record<string, { bg: string; border: string; text: string }> = {
  slave: { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.4)", text: "#7dd3fc" },
  function: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.4)", text: "#6ee7b7" },
  address: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)", text: "#c4b5fd" },
  count: { bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.4)", text: "#67e8f9" },
  crc: { bg: "rgba(251,113,133,0.12)", border: "rgba(251,113,133,0.4)", text: "#fda4af" },
};

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
            Tool · Modbus RTU
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
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1 }}>
            Modbus Playground
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 26,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            <span>브라우저에서 요청 프레임을 조립하고,</span>
            <span>CRC-16 을 다시 계산해 눈으로 검증합니다.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {frameBytes.map((b, i) => {
            const c = colors[b.role];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                  fontFamily: "monospace",
                }}
              >
                <span style={{ color: c.text, fontSize: 26, fontWeight: 700 }}>
                  {b.value}
                </span>
                <span style={{ color: "#71717a", fontSize: 10 }}>
                  {String(i).padStart(2, "0")}
                </span>
              </div>
            );
          })}
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
            woong4252.vercel.app/projects/modbus-playground
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
