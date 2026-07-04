export const meta = {
  slug: "modbus-rtu-basics",
  title: "Modbus RTU 최소한만 알기",
  description:
    "산업 현장에서 만나는 Modbus RTU 를, 면접·필드 디버깅에서 방어할 정도만 압축해서 정리. 프레임 구조 · Function Code 3종 · CRC-16 원리까지.",
  date: "2026-07-04",
  readingTimeMin: 6,
  tags: ["IoT", "Modbus RTU", "ESP32", "Serial"],
};

export default function Post() {
  return (
    <article className="prose-invert space-y-8 text-muted leading-relaxed">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          왜 아직도 Modbus 인가
        </h2>
        <p>
          Modbus RTU 는 1979 년 Modicon (지금 슈나이더) 이 만든 시리얼 명령/응답
          프로토콜이다. 40 년 넘게 산업 현장에서 표준이 된 이유는 세 가지 —
          단순함, 반도체가 값싸다, 벤더 종속이 없다. ESP32 같은 마이크로컨트롤러
          한 개와 몇백 원짜리 트랜시버로 온도계·전력계·PLC 를 통째로 물릴 수
          있다.
        </p>
        <p>
          이 글은 &ldquo;내가 만든 도구
          <a
            href="/projects/modbus-playground"
            className="mx-1 underline decoration-border underline-offset-2 hover:text-foreground"
          >
            Modbus Playground
          </a>
          을 방어할 정도&rdquo; 만 남긴 요약이다. 5 분 안에 훑고, 필드에서 CRC
          가 안 맞을 때 꺼내 볼 수 있는 최소 지식.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          프레임은 언제나 이 모양
        </h2>
        <pre className="rounded border border-border/60 bg-background/40 p-4 overflow-x-auto font-mono text-xs">
{`[ Slave ID ][ Function Code ][   Data   ][   CRC   ]
   1 byte       1 byte         가변         2 byte`}
        </pre>
        <ul className="space-y-2 pl-4">
          <li>
            <strong className="text-foreground">Slave ID (1B)</strong> · 누구와
            대화하는가. 1–247.
          </li>
          <li>
            <strong className="text-foreground">Function Code (1B)</strong> ·
            무엇을 시키는가 (동사).
          </li>
          <li>
            <strong className="text-foreground">Data</strong> · FC 별로 스키마가
            다름.
          </li>
          <li>
            <strong className="text-foreground">CRC (2B)</strong> · 전송 중
            비트가 뒤집혔는지 검증.
          </li>
        </ul>
        <p>응답도 같은 모양이다. 다만 Data 필드가 채워져서 돌아온다.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Function Code — 세 개면 실무 95%
        </h2>
        <div className="rounded border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background/40">
              <tr>
                <th className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                  FC
                </th>
                <th className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                  이름
                </th>
                <th className="text-left px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                  하는 일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">0x03</td>
                <td className="px-3 py-2 text-foreground">
                  Read Holding Registers
                </td>
                <td className="px-3 py-2">
                  &ldquo;16bit 레지스터 여러 개 읽어와&rdquo; 가장 자주 씀
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">0x06</td>
                <td className="px-3 py-2 text-foreground">
                  Write Single Register
                </td>
                <td className="px-3 py-2">한 주소에 한 값 쓰기</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">0x10</td>
                <td className="px-3 py-2 text-foreground">
                  Write Multiple Registers
                </td>
                <td className="px-3 py-2">여러 주소를 한 번에 쓰기</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Holding Register 는 슬레이브 안의 16 비트 R/W 메모리다. 어느 주소에
          무엇이 있는지는 <strong className="text-foreground">벤더 매뉴얼</strong>
          이 결정한다 — 프로토콜의 몫이 아니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Endianness 함정 하나
        </h2>
        <p>
          16bit 값은 항상 <strong className="text-foreground">큰 바이트 먼저</strong>
          . 예: 주소 <code className="font-mono text-foreground">0x0102</code> →{" "}
          <code className="font-mono text-foreground">01 02</code>. 단,{" "}
          <strong className="text-foreground">CRC 만은 예외</strong> — 낮은
          바이트 먼저 전송한다. <code className="font-mono text-foreground">0x0BC4</code>{" "}
          → <code className="font-mono text-foreground">C4 0B</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          CRC-16 한 문단
        </h2>
        <p>
          다항식 <code className="font-mono text-foreground">0xA001</code> (표준
          0x8005 의 reflected form), 초기값{" "}
          <code className="font-mono text-foreground">0xFFFF</code>. 매 바이트마다
          XOR 후 8 번 오른쪽 시프트, LSB 가 1 이면 다항식과 XOR. 수신 측이 같은
          계산을 다시 해서 비교. 불일치면{" "}
          <strong className="text-foreground">조용히 버림</strong> — Modbus
          엔 NACK 이 없다.
        </p>
        <pre className="rounded border border-border/60 bg-background/40 p-4 overflow-x-auto font-mono text-xs text-foreground">
{`crc = 0xFFFF
for byte in bytes:
    crc ^= byte
    for _ in range(8):
        crc = (crc >> 1) ^ 0xA001 if (crc & 1) else (crc >> 1)
return crc`}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          면접에서 나올 만한 것
        </h2>
        <ul className="space-y-3 pl-4">
          <li>
            <p className="text-foreground font-medium">
              Q. 왜 RS485 인가요? 이더넷 안 쓰고?
            </p>
            <p className="text-sm mt-1">
              현장은 케이블이 길고 노이즈가 많고 오래된 장비가 많아서 — RS485 는
              1.2km 까지 트위스트 페어로 갈 수 있고 트랜시버가 몇백 원이라 장비
              하나하나에 붙일 수 있다. Modbus TCP 도 있지만 계량기·검출기는 여전히
              RS485 가 표준.
            </p>
          </li>
          <li>
            <p className="text-foreground font-medium">
              Q. FC 03 과 04 의 차이는?
            </p>
            <p className="text-sm mt-1">
              03 은 Holding Register 읽기 (R/W), 04 는 Input Register 읽기 (R
              only). 현장에서는 대부분 03 을 쓴다.
            </p>
          </li>
          <li>
            <p className="text-foreground font-medium">
              Q. 프레임과 프레임 사이의 &ldquo;Silent interval&rdquo; 왜
              중요한가?
            </p>
            <p className="text-sm mt-1">
              최소 3.5 문자 시간 (9600 baud 에서 ~4ms) 을 쉬어야 슬레이브가
              프레임 경계를 정확히 잡는다. 안 쉬면 두 프레임이 하나로 이어져서
              CRC 가 항상 깨진다.
            </p>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          더 팔 곳
        </h2>
        <ul className="space-y-2 pl-4">
          <li>
            공식 스펙 — Modbus over Serial Line V1.02 (PDF, modbus.org).
          </li>
          <li>
            CRC 교차 검증 —{" "}
            <a
              href="https://crccalc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              crccalc.com
            </a>{" "}
            → CRC-16/MODBUS.
          </li>
          <li>
            내 도구 —{" "}
            <a
              href="/projects/modbus-playground"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              Modbus Playground
            </a>{" "}
            에서 프레임을 조립·파싱·검증.
          </li>
        </ul>
      </section>
    </article>
  );
}
