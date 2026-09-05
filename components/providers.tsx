"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        {children}
        <Toaster />
      </NuqsAdapter>
    </ThemeProvider>
  )
}
