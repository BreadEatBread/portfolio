import { readFile } from "node:fs/promises";
import path from "node:path";
import { SourceTabs, type SourceFile } from "./SourceTabs";

const targets: { path: string; language: string }[] = [
  { path: "arduino/factory-node.ino", language: "C++ / Arduino" },
  { path: "scripts/mqtt-publisher.mjs", language: "Node.js" },
  { path: "lib/dashboard/simulator.ts", language: "TypeScript" },
];

async function load(): Promise<SourceFile[]> {
  const root = process.cwd();
  return Promise.all(
    targets.map(async (t) => ({
      path: t.path,
      language: t.language,
      content: await readFile(path.join(root, t.path), "utf-8"),
    })),
  );
}

export async function SourceViewer() {
  const files = await load();
  return (
    <section className="space-y-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
          Source
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          소스 코드 살펴보기
        </h3>
        <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
          위 대시보드를 실제로 굴리는 3개 파일입니다. ESP32 하드웨어 스케치,
          Node.js MQTT 퍼블리셔, 브라우저 시뮬레이터를 각각 확인할 수 있습니다.
        </p>
      </div>
      <SourceTabs files={files} />
    </section>
  );
}
