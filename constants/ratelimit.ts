import type { RateLimit } from "@/types/ratelimit"

import type { LimiterKind } from "@/types/ratelimit"
export const LIMITS: Record<LimiterKind, RateLimit> = {
  lookup: { requests: 20, windowMs: 60 * 60 * 1000 },
  render: { requests: 10, windowMs: 60 * 60 * 1000 },
}
