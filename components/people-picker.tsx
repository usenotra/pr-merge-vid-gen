"use client"

import { CheckIcon } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import type { PrMergePerson } from "@/types/pr-merge-video"

const AVATAR_SIZE_PX = 80

export function PeoplePicker({
  people,
  selectedLogins,
  maxSelected,
  truncated,
  onToggle,
}: {
  people: PrMergePerson[]
  selectedLogins: string[]
  maxSelected: number
  truncated: boolean
  onToggle: (login: string) => void
}) {
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
      <div className="-mx-1 grid min-h-0 flex-1 grid-cols-1 content-start gap-1.5 overflow-y-auto px-1 pb-1">
        {people.map((person) => {
          const selected = selectedLogins.includes(person.login)
          return (
            <button
              aria-pressed={selected}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.96]",
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
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                )}
              >
                {selected ? (
                  <CheckIcon aria-hidden="true" className="size-3" />
                ) : null}
              </span>
            </button>
          )
        })}
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
