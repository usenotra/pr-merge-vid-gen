"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface SwapLabelProps {
  /** Changing this key triggers the swap animation. */
  swapKey: string
  children: ReactNode
  className?: string
  /**
   * Every possible label, rendered invisibly in the same cell so the
   * container keeps the width of the widest one and never shifts.
   */
  sizers?: ReactNode[]
}

/**
 * Cross-fades content: the new label slides up from below with a blur,
 * the old one lifts out through the top. Sized by the current content.
 */
export function SwapLabel({
  swapKey,
  children,
  className,
  sizers,
}: SwapLabelProps) {
  const previous = useRef({ key: swapKey, node: children })
  const [leaving, setLeaving] = useState<{
    key: string
    node: ReactNode
  } | null>(null)

  useEffect(() => {
    if (swapKey !== previous.current.key) {
      setLeaving(previous.current)
    }
    previous.current = { key: swapKey, node: children }
  }, [swapKey, children])

  return (
    <span className={cn("relative inline-grid overflow-hidden", className)}>
      {sizers?.map((sizer, index) => (
        <span
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5"
          key={index}
        >
          {sizer}
        </span>
      ))}
      <span
        className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 motion-safe:animate-[swap-in_260ms_cubic-bezier(0.22,1,0.36,1)_both]"
        key={swapKey}
      >
        {children}
      </span>
      {leaving ? (
        <span
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 motion-safe:animate-[swap-out_220ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:hidden"
          key={leaving.key}
          onAnimationEnd={() => setLeaving(null)}
        >
          {leaving.node}
        </span>
      ) : null}
    </span>
  )
}
