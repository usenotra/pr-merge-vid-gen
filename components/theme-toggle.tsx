"use client"

import type { ThemeToggleProps } from "@/types/appearance"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

const subscribe = () => () => {}

function startThemeTransition(update: () => void) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
  if (reduceMotion || typeof document.startViewTransition !== "function") {
    update()
    return
  }
  document.startViewTransition(update)
}

export function ThemeToggle({ className }: ThemeToggleProps) {
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
      className={cn(
        "group/theme relative rounded-full active:translate-y-0 [&_svg]:transition-[transform,opacity] [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.22,1,0.36,1)]",
        className
      )}
      onClick={() =>
        startThemeTransition(() => setTheme(isDark ? "light" : "dark"))
      }
      size="icon"
      variant="ghost"
    >
      <SunIcon
        className={
          isDark
            ? "absolute scale-100 rotate-0 opacity-100"
            : "absolute scale-50 -rotate-90 opacity-0"
        }
      />
      <MoonIcon
        className={
          isDark
            ? "absolute scale-50 rotate-90 opacity-0"
            : "absolute scale-100 rotate-0 opacity-100"
        }
      />
    </Button>
  )
}
