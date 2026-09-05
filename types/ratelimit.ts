export type LimiterKind = "lookup" | "render"

export type RateLimit = { requests: number; windowMs: number }
