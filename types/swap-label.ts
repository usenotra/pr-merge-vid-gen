import type { ReactNode } from "react"
export interface SwapLabelProps {
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

export type SwapLabelContent = {
  key: string
  node: ReactNode
}
