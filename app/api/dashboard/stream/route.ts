import { getOrCreateSession, touchSession } from "@/lib/dashboard/session-store";
import type { DeviceState } from "@/lib/dashboard/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const TICK_MS = 500;
const VALID_STATES: DeviceState[] = ["running", "idle", "warning", "error"];

/**
 * GET  → Server-Sent Events 스트림
 * POST → Force State · Reset 제어
 *
 * 원래 stream 과 control 을 별도 route 로 두려 했지만, Vercel Edge Runtime 은
 * route file 간 module 상태 공유를 보장하지 않아 세션 저장소가 갈렸다. 두
 * 핸들러를 같은 파일로 합치면 동일 module 안에서 Map 을 공유할 수 있다.
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session") ?? crypto.randomUUID();

  const sim = getOrCreateSession(sessionId);
  const encoder = new TextEncoder();

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

      send("hello", { ts: Date.now(), tickMs: TICK_MS, sessionId });

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

type ForcePayload = {
  action: "force-state";
  session: string;
  deviceId: string;
  state: DeviceState;
};

type ResetPayload = {
  action: "reset";
  session: string;
};

type Payload = ForcePayload | ResetPayload;

function bad(reason: string, status = 400) {
  return Response.json({ ok: false, reason }, { status });
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return bad("invalid JSON body");
  }

  if (!body?.session || typeof body.session !== "string") {
    return bad("missing session");
  }

  const sim = touchSession(body.session);
  if (!sim) {
    return bad("session not found (재연결 필요)", 410);
  }

  if (body.action === "force-state") {
    if (!body.deviceId) return bad("missing deviceId");
    if (!VALID_STATES.includes(body.state)) return bad("invalid state");
    sim.forceState(body.deviceId, body.state);
    return Response.json({ ok: true });
  }

  if (body.action === "reset") {
    sim.reset();
    return Response.json({ ok: true });
  }

  return bad("unknown action");
}
