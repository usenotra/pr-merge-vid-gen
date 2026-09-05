"use client"

import type { PeoplePickerProps } from "@/types/people-picker"

import { AVATAR_SIZE_PX } from "@/constants/people-picker"

import { CheckIcon } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

import { useScrollOverflow } from "@/hooks/use-scroll-overflow"
import { cn } from "cn"

export function PeoplePicker({
  people,
  selectedLogins,
  maxSelected,
  truncated,
  onToggle,
}: PeoplePickerProps) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const hasMoreBelow = useScrollOverflow(listRef)

  return (
    <section className="flex min-h-0 w-full flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-sm font-semibold tracking-tight">
            Choose people
          </h2>
          <p className="text-xs text-pretty text-muted-foreground">
            Bots excluded. Up to {maxSelected}.
          </p>
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {selectedLogins.length}/{maxSelected}
        </p>
      </div>
      <div className="relative min-h-0 flex-1">
        <div
          className="-mx-1 grid h-full grid-cols-1 content-start gap-1.5 overflow-y-auto px-1 pb-1"
          ref={listRef}
        >
          {people.map((person) => {
            const selected = selectedLogins.includes(person.login)
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.99]",
                  selected
                    ? "border-primary/30 bg-brand-wash"
                    : "border-border bg-background hover:bg-muted/60"
                )}
                key={person.login}
                onClick={() => onToggle(person.login)}
                type="button"
              >
                <Image
                  alt=""
                  className="size-8 rounded-full object-cover outline outline-black/10 dark:outline-white/10"
                  height={AVATAR_SIZE_PX}
                  src={person.avatarUrl}
                  width={AVATAR_SIZE_PX}
                />
                <span className="min-w-0 grow">
                  <span className="block truncate text-sm font-medium">
                    {person.name || person.login}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    @{person.login} · {person.merges.toLocaleString("en-US")}{" "}
                    {person.merges === 1 ? "merge" : "merges"}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    selected
                      ? "scale-100 border-primary bg-primary text-primary-foreground opacity-100"
                      : "scale-90 border-input opacity-70"
                  )}
                >
                  <CheckIcon
                    aria-hidden="true"
                    className={cn(
                      "size-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    )}
                  />
                </span>
              </button>
            )
          })}
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent transition-opacity duration-200",
            hasMoreBelow ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
      {truncated ? (
        <p className="text-xs text-pretty text-muted-foreground">
          This repository exceeded GitHub&apos;s 1,000-result search limit; the
          ranking uses the available results.
        </p>
      ) : null}
    </section>
  )
}
