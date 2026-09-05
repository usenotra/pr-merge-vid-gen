"use client"

import type { GithubStatusLoadState } from "@/types/github"

import { idleStatus } from "@/constants/github-status"

import { useEffect, useState, useSyncExternalStore } from "react"

import {
  getGithubLogin,
  getServerGithubLogin,
  subscribeToGithubConnection,
} from "@/lib/github-connection"
import type { GithubStatus } from "@/types/github"

export function useGithubStatus(): GithubStatus & GithubStatusLoadState {
  const cookieLogin = useSyncExternalStore(
    subscribeToGithubConnection,
    getGithubLogin,
    getServerGithubLogin
  )
  const [status, setStatus] = useState<GithubStatus>({
    ...idleStatus,
    login: cookieLogin,
    connected: cookieLogin !== null,
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch("/api/github/status", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          return
        }
        const json: GithubStatus = await response.json()
        setStatus(json)
        setLoaded(true)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus({
            connected: cookieLogin !== null,
            login: cookieLogin,
            oauthConfigured: false,
          })
          setLoaded(true)
        }
      })

    return () => controller.abort()
  }, [cookieLogin])

  return { ...status, loaded }
}
