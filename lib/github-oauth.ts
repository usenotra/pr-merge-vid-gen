import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto"

import type { NextRequest, NextResponse } from "next/server"

import {
  GITHUB_CONNECTED_COOKIE,
  GITHUB_COOKIE_PATH,
  GITHUB_TOKEN_COOKIE,
  GITHUB_TOKEN_COOKIE_PATH,
} from "@/lib/github-cookies"
import {
  githubAccessTokenSchema,
  githubOAuthStatesSchema,
  githubViewerSchema,
  MAX_PENDING_OAUTH_STATES,
} from "@/schemas/github"
import type { GithubOAuthConfig, GithubOAuthState } from "@/types/github"

const AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
const TOKEN_URL = "https://github.com/login/oauth/access_token"
const VIEWER_URL = "https://api.github.com/user"
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const STATE_LENGTH = 16
const CALLBACK_PATH = "/api/github/callback"
const USER_AGENT = "pr-merge-vid-gen"

export function getGithubOAuthConfig(): GithubOAuthConfig | null {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!(clientId && clientSecret)) {
    return null
  }
  return { clientId, clientSecret }
}

export function getGithubCallbackUrl(request: NextRequest): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const origin =
    process.env.VERCEL_ENV === "production" && siteUrl
      ? siteUrl
      : request.nextUrl.origin
  return new URL(CALLBACK_PATH, origin).toString()
}

export function fingerprintGithubToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function clearGithubCookies(response: NextResponse): void {
  response.cookies.delete({
    name: GITHUB_TOKEN_COOKIE,
    path: GITHUB_TOKEN_COOKIE_PATH,
  })
  response.cookies.delete({
    name: GITHUB_CONNECTED_COOKIE,
    path: GITHUB_COOKIE_PATH,
  })
}

export function readPendingOAuthStates(
  value: string | undefined
): GithubOAuthState[] {
  if (!value) {
    return []
  }
  try {
    const parsed = githubOAuthStatesSchema.safeParse(JSON.parse(value))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function appendPendingOAuthState(
  states: GithubOAuthState[],
  next: GithubOAuthState
): GithubOAuthState[] {
  return [...states, next].slice(-MAX_PENDING_OAUTH_STATES)
}

export function createOAuthState(): string {
  return randomBytes(STATE_LENGTH).toString("hex")
}

export function buildGithubAuthorizeUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const url = new URL(AUTHORIZE_URL)
  url.searchParams.set("client_id", clientId)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("state", state)
  return url.toString()
}

export async function exchangeGithubCode(
  code: string,
  redirectUri: string,
  config: GithubOAuthConfig
): Promise<string | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })
    if (!res.ok) {
      return null
    }
    const parsed = githubAccessTokenSchema.safeParse(await res.json())
    return parsed.success ? parsed.data.access_token : null
  } catch {
    return null
  }
}

export async function fetchGithubLogin(token: string): Promise<string | null> {
  try {
    const res = await fetch(VIEWER_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": USER_AGENT,
      },
      cache: "no-store",
    })
    if (!res.ok) {
      return null
    }
    const parsed = githubViewerSchema.safeParse(await res.json())
    return parsed.success ? parsed.data.login : null
  } catch {
    return null
  }
}

function encryptionKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest()
}

export function encryptGithubToken(token: string, secret: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv)
  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ])
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url"
  )
}

function decryptGithubToken(value: string, secret: string): string | null {
  try {
    const raw = Buffer.from(value, "base64url")
    const iv = raw.subarray(0, IV_LENGTH)
    const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8")
  } catch {
    return null
  }
}

export function readGithubToken(request: NextRequest): string | null {
  const config = getGithubOAuthConfig()
  if (config) {
    const cookie = request.cookies.get(GITHUB_TOKEN_COOKIE)?.value
    if (cookie) {
      return decryptGithubToken(cookie, config.clientSecret)
    }
  }

  const fallback = process.env.GITHUB_TOKEN
  if (fallback && !config) {
    return fallback
  }

  return null
}
