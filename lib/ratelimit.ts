import { createHash } from "node:crypto"

import type { NextRequest } from "next/server"

type LimiterKind = "lookup" | "render"

const LIMITS: Record<LimiterKind, { requests: number; windowMs: number }> = {
  lookup: { requests: 20, windowMs: 60 * 60 * 1000 },
  render: { requests: 10, windowMs: 60 * 60 * 1000 },
}

const buckets = new Map<string, number[]>()

function getClientIp(request: NextRequest): string {
  if (process.env.VERCEL) {
    return (
      request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown"
    )
  }

  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  )
}

export function isRateLimited(
  request: NextRequest,
  kind: LimiterKind
): boolean {
  const key = `${kind}:${createHash("sha256").update(getClientIp(request)).digest("hex")}`
  const now = Date.now()
  const limit = LIMITS[kind]
  const recent = (buckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < limit.windowMs
  )

  if (recent.length >= limit.requests) {
    buckets.set(key, recent)
    return true
  }

  recent.push(now)
  buckets.set(key, recent)
  return false
}
