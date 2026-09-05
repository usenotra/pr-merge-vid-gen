import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { GITHUB_CONNECTED_COOKIE } from "@/lib/github-cookies"
import { getGithubOAuthConfig, readGithubToken } from "@/lib/github-oauth"

export const runtime = "nodejs"

export function GET(request: NextRequest) {
  const token = readGithubToken(request)
  const login = request.cookies.get(GITHUB_CONNECTED_COOKIE)?.value ?? null

  return NextResponse.json({
    connected: Boolean(token),
    login,
    oauthConfigured: Boolean(getGithubOAuthConfig()),
  })
}
