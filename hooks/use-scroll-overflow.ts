"use client"

import { type RefObject, useEffect, useState } from "react"

const EDGE_THRESHOLD_PX = 2

/**
 * Tracks whether a scroll container has hidden content below the fold.
 * Recomputes on scroll, resize and content changes.
 */
export function useScrollOverflow(ref: RefObject<HTMLElement | null>) {
  const [hasMoreBelow, setHasMoreBelow] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const update = () => {
      const remaining = node.scrollHeight - node.clientHeight - node.scrollTop
      setHasMoreBelow(remaining > EDGE_THRESHOLD_PX)
    }

    update()
    node.addEventListener("scroll", update, { passive: true })
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(node)
    const mutationObserver = new MutationObserver(update)
    mutationObserver.observe(node, { childList: true, subtree: true })

    return () => {
      node.removeEventListener("scroll", update)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [ref])

  return hasMoreBelow
}
