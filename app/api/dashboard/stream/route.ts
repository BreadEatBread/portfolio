import { createSimulator } from "@/lib/dashboard/simulator";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const TICK_MS = 500;
const WARMUP_TICKS = 30;

export async function GET(request: Request) {
  const sim = createSimulator();
  const encoder = new TextEncoder();

  // Prime a bit of history so the first frame the client sees is not empty.
  for (let i = 0; i < WARMUP_TICKS; i++) {
    sim.tick(Date.now() - (WARMUP_TICKS - i) * TICK_MS);
  }

  const stream = new ReadableStream({
    async start(controller) {
      let cancelled = false;
      const abort = () => {
        cancelled = true;
      };
      request.signal.addEventListener("abort", abort);

      const send = (event: string, payload: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`,
            ),
          );
        } catch {
          cancelled = true;
        }
      };

      send("hello", { ts: Date.now(), tickMs: TICK_MS });

      try {
        while (!cancelled) {
          const snapshot = sim.tick(Date.now());
          send("tick", {
            ts: Date.now(),
            devices: snapshot.devices,
            events: snapshot.events,
          });
          await new Promise((r) => setTimeout(r, TICK_MS));
        }
      } finally {
        request.signal.removeEventListener("abort", abort);
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
