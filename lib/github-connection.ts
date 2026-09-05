import { GITHUB_CONNECTED_COOKIE } from "@/constants/github-cookies"

export function subscribeToGithubConnection(listener: () => void): () => void {
  window.addEventListener("focus", listener)
  document.addEventListener("visibilitychange", listener)
  return () => {
    window.removeEventListener("focus", listener)
    document.removeEventListener("visibilitychange", listener)
  }
}

export function getGithubLogin(): string | null {
  const prefix = `${GITHUB_CONNECTED_COOKIE}=`
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix))
  if (!entry) {
    return null
  }
  const value = decodeURIComponent(entry.slice(prefix.length))
  return value.length > 0 ? value : null
}

export function getServerGithubLogin(): string | null {
  return null
}

export function buildGithubConnectHref(repoParam: string | null): string {
  const params = new URLSearchParams()
  if (repoParam) {
    params.set("repo", repoParam)
  }
  const query = params.toString()
  return `/api/github/authorize${query ? `?${query}` : ""}`
}
