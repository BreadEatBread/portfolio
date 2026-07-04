import {
  check,
  createClientState,
  type Algorithm,
  type ClientState,
} from "@/lib/ratelimit/algorithms";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ClientEntry = {
  state: ClientState;
  lastActive: number;
};

const clients = new Map<string, ClientEntry>();
const CLIENT_TTL_MS = 10 * 60 * 1000;

function reap(now: number) {
  for (const [id, c] of clients) {
    if (now - c.lastActive > CLIENT_TTL_MS) clients.delete(id);
  }
}

function getClientState(id: string, now: number): ClientState {
  reap(now);
  const existing = clients.get(id);
  if (existing) {
    existing.lastActive = now;
    return existing.state;
  }
  const state = createClientState(now);
  clients.set(id, { state, lastActive: now });
  return state;
}

const VALID_ALGORITHMS: Algorithm[] = [
  "fixed_window",
  "sliding_window",
  "token_bucket",
];

export async function POST(request: Request) {
  const now = Date.now();
  let body: { client?: string; algorithm?: Algorithm };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid JSON" }, { status: 400 });
  }

  const clientId = body.client;
  if (!clientId || typeof clientId !== "string") {
    return Response.json({ ok: false, reason: "missing client" }, { status: 400 });
  }
  const algorithm = body.algorithm;
  if (!algorithm || !VALID_ALGORITHMS.includes(algorithm)) {
    return Response.json(
      { ok: false, reason: "invalid algorithm" },
      { status: 400 },
    );
  }

  const state = getClientState(clientId, now);
  const result = check(state, algorithm, now);

  return Response.json(
    {
      ok: true,
      ts: now,
      ...result,
    },
    {
      status: result.accepted ? 200 : 429,
      headers: {
        "X-RateLimit-Algorithm": algorithm,
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        ...(result.accepted
          ? {}
          : {
              "Retry-After": String(
                Math.max(1, Math.ceil((result.resetAt - now) / 1000)),
              ),
            }),
      },
    },
  );
}
