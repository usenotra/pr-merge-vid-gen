"use client"

import type { ChildrenProps } from "@/types/layout"

import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: ChildrenProps) {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        {children}
        <Toaster />
      </NuqsAdapter>
    </ThemeProvider>
  )
}
