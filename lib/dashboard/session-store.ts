import { createSimulator, type Simulator } from "./simulator";

type Session = {
  sim: Simulator;
  lastActive: number;
};

// Module-scope 는 Edge 인스턴스가 warm 인 동안 유지된다.
// Edge 인스턴스가 evict 되면 세션이 함께 사라지지만, 데모 규모에선 충분.
const sessions = new Map<string, Session>();

const SESSION_TTL_MS = 10 * 60 * 1000;

function reap(now: number) {
  for (const [id, s] of sessions) {
    if (now - s.lastActive > SESSION_TTL_MS) sessions.delete(id);
  }
}

export function getOrCreateSession(sessionId: string): Simulator {
  const now = Date.now();
  reap(now);
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.lastActive = now;
    return existing.sim;
  }
  const sim = createSimulator();
  // Prime some history so first client frame isn't sparse
  for (let i = 0; i < 30; i++) sim.tick(now - (30 - i) * 500);
  sessions.set(sessionId, { sim, lastActive: now });
  return sim;
}

export function touchSession(sessionId: string): Simulator | null {
  const existing = sessions.get(sessionId);
  if (!existing) return null;
  existing.lastActive = Date.now();
  return existing.sim;
}
