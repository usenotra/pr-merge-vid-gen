"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import {
  DITHER_IDLE_FALLBACK_MS,
  DITHER_VIEWPORT_MARGIN,
} from "@/constants/dithering"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import {
  getDitherEnvironmentServerSnapshot,
  getPageVisibleSnapshot,
  subscribeToPageVisibility,
} from "@/lib/dither-environment"
import type { DitherVisibilityState } from "@/types/dithering"

export function useDitherVisibility(): DitherVisibilityState {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isIdle, setIsIdle] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const isPageVisible = useSyncExternalStore(
    subscribeToPageVisibility,
    getPageVisibleSnapshot,
    getDitherEnvironmentServerSnapshot
  )
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => setIsIdle(true))
      return () => window.cancelIdleCallback(idleId)
    }
    const timeoutId = window.setTimeout(
      () => setIsIdle(true),
      DITHER_IDLE_FALLBACK_MS
    )
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        setIsInView(visible)
        if (visible) {
          setHasEntered(true)
        }
      },
      { rootMargin: DITHER_VIEWPORT_MARGIN }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return {
    containerRef,
    shouldRender: isIdle && hasEntered,
    isAnimating: isInView && isPageVisible && !prefersReducedMotion,
  }
}
