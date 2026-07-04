export type Algorithm = "fixed_window" | "sliding_window" | "token_bucket";

export type CheckResult = {
  accepted: boolean;
  remaining: number;
  resetAt: number;
  algorithm: Algorithm;
  state: AlgorithmSnapshot;
};

export type AlgorithmSnapshot =
  | {
      kind: "fixed_window";
      windowStart: number;
      windowEnd: number;
      count: number;
      limit: number;
    }
  | {
      kind: "sliding_window";
      requests: number[];
      windowMs: number;
      limit: number;
    }
  | {
      kind: "token_bucket";
      tokens: number;
      capacity: number;
      refillPerSec: number;
    };

export const CONFIG = {
  fixed_window: { limit: 10, windowMs: 10_000 },
  sliding_window: { limit: 10, windowMs: 10_000 },
  token_bucket: { capacity: 10, refillPerSec: 1 },
} as const;

type FixedWindowState = { windowStart: number; count: number };
type SlidingWindowState = { requests: number[] };
type TokenBucketState = { tokens: number; lastRefill: number };

export type ClientState = {
  fixed_window: FixedWindowState;
  sliding_window: SlidingWindowState;
  token_bucket: TokenBucketState;
};

export function createClientState(now: number): ClientState {
  return {
    fixed_window: { windowStart: 0, count: 0 },
    sliding_window: { requests: [] },
    token_bucket: { tokens: CONFIG.token_bucket.capacity, lastRefill: now },
  };
}

function fixedWindow(
  state: FixedWindowState,
  now: number,
): CheckResult {
  const { limit, windowMs } = CONFIG.fixed_window;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  if (state.windowStart !== windowStart) {
    state.windowStart = windowStart;
    state.count = 0;
  }
  const windowEnd = windowStart + windowMs;
  const accepted = state.count < limit;
  if (accepted) state.count += 1;
  return {
    accepted,
    remaining: Math.max(0, limit - state.count),
    resetAt: windowEnd,
    algorithm: "fixed_window",
    state: {
      kind: "fixed_window",
      windowStart,
      windowEnd,
      count: state.count,
      limit,
    },
  };
}

function slidingWindow(
  state: SlidingWindowState,
  now: number,
): CheckResult {
  const { limit, windowMs } = CONFIG.sliding_window;
  const cutoff = now - windowMs;
  state.requests = state.requests.filter((t) => t > cutoff);
  const accepted = state.requests.length < limit;
  if (accepted) state.requests.push(now);
  const oldest = state.requests[0];
  return {
    accepted,
    remaining: Math.max(0, limit - state.requests.length),
    resetAt: (oldest ?? now) + windowMs,
    algorithm: "sliding_window",
    state: {
      kind: "sliding_window",
      requests: [...state.requests],
      windowMs,
      limit,
    },
  };
}

function tokenBucket(
  state: TokenBucketState,
  now: number,
): CheckResult {
  const { capacity, refillPerSec } = CONFIG.token_bucket;
  const elapsedSec = Math.max(0, (now - state.lastRefill) / 1000);
  state.tokens = Math.min(capacity, state.tokens + elapsedSec * refillPerSec);
  state.lastRefill = now;
  const accepted = state.tokens >= 1;
  if (accepted) state.tokens -= 1;
  const shortfall = Math.max(0, 1 - state.tokens);
  return {
    accepted,
    remaining: Math.floor(state.tokens),
    resetAt: now + Math.ceil((shortfall * 1000) / refillPerSec),
    algorithm: "token_bucket",
    state: {
      kind: "token_bucket",
      tokens: state.tokens,
      capacity,
      refillPerSec,
    },
  };
}

export function check(
  client: ClientState,
  algorithm: Algorithm,
  now: number,
): CheckResult {
  if (algorithm === "fixed_window") return fixedWindow(client.fixed_window, now);
  if (algorithm === "sliding_window")
    return slidingWindow(client.sliding_window, now);
  return tokenBucket(client.token_bucket, now);
}
