import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { GITHUB_STATE_COOKIE } from "@/lib/github-cookies"
import { clearGithubCookies } from "@/lib/github-oauth"

export const runtime = "nodejs"

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.nextUrl.origin))
  clearGithubCookies(response)
  response.cookies.delete({
    name: GITHUB_STATE_COOKIE,
    path: "/",
  })
  return response
}
