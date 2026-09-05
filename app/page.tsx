import { Suspense } from "react"

import { DeferredDithering } from "@/components/deferred-dithering"
import { MergePreview } from "@/components/merge-preview"
import { RepoForm } from "@/components/repo-form"
import { SiteHeader } from "@/components/site-header"
import { NOTRA_DITHER_PRESET } from "@/constants/dithering"

export default function HomePage() {
  return (
    <main
      className="mx-auto flex h-svh w-full max-w-6xl flex-col gap-5 overflow-hidden px-4 py-4 max-lg:h-auto max-lg:min-h-svh max-lg:overflow-y-auto sm:px-6"
      id="content"
    >
      <SiteHeader />
      <section className="relative isolate shrink-0 overflow-clip rounded-3xl bg-brand-wash">
        <div className="pointer-events-none absolute inset-0 overflow-clip rounded-3xl">
          <DeferredDithering
            {...NOTRA_DITHER_PRESET}
            className="absolute -top-24 -left-16 h-[calc(100%+12rem)] w-[calc(100%+8rem)]"
          />
        </div>
        <div className="relative flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[1.75rem] leading-[1.1] font-medium tracking-[-0.045em] text-balance text-brand-ink sm:text-[2.25rem] dark:text-white">
              Who shipped the most pull requests?
            </h1>
            <p className="max-w-xl font-sans text-sm leading-relaxed font-medium text-pretty text-brand-ink/75 sm:text-[0.9375rem] dark:text-white/70">
              Pick a public repo and time range, choose the people, then
              download a share-ready MP4 leaderboard.
            </p>
          </div>
          <Suspense>
            <RepoForm />
          </Suspense>
        </div>
      </section>
      <div className="min-h-0 min-w-0 flex-1">
        <Suspense>
          <MergePreview />
        </Suspense>
      </div>
    </main>
  )
}
