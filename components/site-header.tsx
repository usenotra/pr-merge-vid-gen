import { NotraMark } from "@/components/notra-mark"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4">
      <a
        className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        href="https://notra.ai"
        rel="noreferrer"
        target="_blank"
      >
        <NotraMark className="size-7 shrink-0 text-brand-ink" />
        <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-[#1e1e1e] dark:text-white">
          Notra
        </span>
        <span
          aria-hidden="true"
          className="h-4 w-px bg-border"
        />
        <span className="font-sans text-sm font-medium text-muted-foreground">
          PR merge video
        </span>
      </a>
      <ThemeToggle />
    </header>
  )
}
