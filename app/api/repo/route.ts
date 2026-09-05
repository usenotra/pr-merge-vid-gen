import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { GITHUB_CONNECTION_REQUIRED_MESSAGE } from "@/constants/github-cookies"
import { clearGithubCookies, readGithubToken } from "@/lib/github-oauth"
import { loadRepoPrMergeData } from "@/lib/load-repo"
import { isRateLimited } from "@/lib/ratelimit"
import { prMergeRepoQuerySchema } from "@/schemas/pr-merge-video"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const githubToken = readGithubToken(request)
  if (!githubToken) {
    return NextResponse.json(
      { error: GITHUB_CONNECTION_REQUIRED_MESSAGE },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const parsed = prMergeRepoQuerySchema.safeParse({
    owner: searchParams.get("owner") ?? "",
    repo: searchParams.get("repo") ?? "",
    days: searchParams.get("days") ?? "",
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    )
  }

  if (isRateLimited(request, "lookup")) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    )
  }

  const { owner, repo, days } = parsed.data
  const result = await loadRepoPrMergeData(owner, repo, days, githubToken)
  if (!result.ok) {
    if (result.kind === "unauthorized") {
      const response = NextResponse.json(
        { error: GITHUB_CONNECTION_REQUIRED_MESSAGE },
        { status: 401 }
      )
      clearGithubCookies(response)
      return response
    }
    if (result.kind === "unavailable") {
      return NextResponse.json(
        { error: "GitHub is unavailable right now. Please try again." },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: "Repository not found." },
      { status: 404 }
    )
  }

  return NextResponse.json(result.data)
}
