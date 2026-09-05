"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

const subscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
