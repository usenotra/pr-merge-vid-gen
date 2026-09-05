import { fingerprintGithubToken } from "@/lib/github-oauth"
import {
  fetchRepoPrMergeData,
  RepoNotFound,
  RepoUnauthorized,
  RepoUnavailable,
} from "@/lib/github-merges"
import type {
  LoadRepoPrMergeResult,
  PrMergePeriodDays,
} from "@/types/pr-merge-video"

function failureKind(
  error: unknown
): "not-found" | "unavailable" | "unauthorized" {
  if (error instanceof RepoUnavailable) {
    return "unavailable"
  }
  if (error instanceof RepoUnauthorized) {
    return "unauthorized"
  }
  if (error instanceof RepoNotFound) {
    return "not-found"
  }
  return "unavailable"
}

const inflight = new Map<string, Promise<LoadRepoPrMergeResult>>()

export function loadRepoPrMergeData(
  owner: string,
  repo: string,
  days: PrMergePeriodDays,
  token: string
): Promise<LoadRepoPrMergeResult> {
  const inflightKey = `${owner}/${repo}:${days}:${fingerprintGithubToken(token)}`
  const existing = inflight.get(inflightKey)
  if (existing) {
    return existing
  }

  const promise = fetchRepoPrMergeData(owner, repo, days, token)
    .then(
      (data): LoadRepoPrMergeResult => ({ ok: true, data }),
      (error): LoadRepoPrMergeResult => ({
        ok: false,
        kind: failureKind(error),
      })
    )
    .finally(() => {
      inflight.delete(inflightKey)
    })

  inflight.set(inflightKey, promise)
  return promise
}
