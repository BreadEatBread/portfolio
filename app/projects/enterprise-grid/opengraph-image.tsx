import { ImageResponse } from "next/og";

export const alt = "Enterprise Grid — 라이브러리 없이 만든 10만 로우 데이터 테이블";
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

const sampleRows = [
  { id: "00001", name: "김정웅", dept: "개발실", role: "대리", city: "서울", active: true },
  { id: "00002", name: "이지현", dept: "기획팀", role: "과장", city: "성남", active: true },
  { id: "00003", name: "박수영", dept: "디자인팀", role: "사원", city: "서울", active: false },
  { id: "00004", name: "최민석", dept: "인프라팀", role: "차장", city: "부산", active: true },
  { id: "00005", name: "정혜진", dept: "영업팀", role: "부장", city: "인천", active: true },
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
            Tool · Enterprise UI
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
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>
            Enterprise Grid
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
            <span>라이브러리 없이 만든 10만 로우 데이터 테이블</span>
            <span>가상 스크롤 · 정렬 · 필터 · 다중 선택 · CSV</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 8,
            border: "1px solid rgba(237,237,237,0.15)",
            overflow: "hidden",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "rgba(237,237,237,0.04)",
              borderBottom: "1px solid rgba(237,237,237,0.12)",
              fontSize: 12,
              color: "#a1a1aa",
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {[
              { label: "ID", w: 90, align: "right" },
              { label: "이름", w: 130 },
              { label: "부서", w: 170 },
              { label: "직급", w: 110 },
              { label: "도시", w: 130 },
              { label: "상태", w: 90, align: "center" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  width: c.w,
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent:
                    c.align === "right"
                      ? "flex-end"
                      : c.align === "center"
                        ? "center"
                        : "flex-start",
                }}
              >
                {c.label}
              </div>
            ))}
          </div>
          {sampleRows.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                borderBottom:
                  i === sampleRows.length - 1
                    ? "none"
                    : "1px solid rgba(237,237,237,0.05)",
                fontSize: 14,
                color: "#ededed",
                background:
                  i === 0 ? "rgba(237,237,237,0.06)" : "transparent",
              }}
            >
              <div style={{ width: 90, padding: "8px 14px", display: "flex", justifyContent: "flex-end", color: "#71717a" }}>
                {r.id}
              </div>
              <div style={{ width: 130, padding: "8px 14px", display: "flex" }}>{r.name}</div>
              <div style={{ width: 170, padding: "8px 14px", display: "flex" }}>{r.dept}</div>
              <div style={{ width: 110, padding: "8px 14px", display: "flex" }}>{r.role}</div>
              <div style={{ width: 130, padding: "8px 14px", display: "flex" }}>{r.city}</div>
              <div style={{ width: 90, padding: "8px 14px", display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 11,
                    border: r.active
                      ? "1px solid rgba(52,211,153,0.4)"
                      : "1px solid rgba(161,161,170,0.4)",
                    background: r.active
                      ? "rgba(52,211,153,0.1)"
                      : "rgba(161,161,170,0.1)",
                    color: r.active ? "#6ee7b7" : "#a1a1aa",
                  }}
                >
                  {r.active ? "재직" : "휴직"}
                </span>
              </div>
            </div>
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
          <div style={{ fontSize: 22, color: "#a1a1aa", fontFamily: "monospace" }}>
            woong4252.vercel.app/projects/enterprise-grid
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
