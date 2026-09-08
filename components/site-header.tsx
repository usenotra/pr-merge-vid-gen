import { NotraMark } from "@/components/notra-mark"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="flex h-9 shrink-0 items-center justify-between gap-4">
      <a
        className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        href="https://www.usenotra.com"
        rel="noreferrer"
        target="_blank"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md p-1 dark:bg-white dark:shadow-[0_0_0_0.0625rem_#1E1E1E14]">
          <NotraMark className="size-7 text-brand-ink" />
        </span>
        <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-[#1e1e1e] dark:text-white">
          Notra
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-border" />
        <span className="font-sans text-sm font-medium text-muted-foreground">
          PR merge video
        </span>
      </a>
      <ThemeToggle className="-mr-2" />
    </header>
  )
}
