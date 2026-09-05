"use client"

import { DownloadIcon } from "lucide-react"
import { Player } from "@remotion/player"
import { useQueryState } from "nuqs"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { NotraMark } from "@/components/notra-mark"
import { PeoplePicker } from "@/components/people-picker"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DEFAULT_PR_MERGE_PERIOD_DAYS,
  DEFAULT_SELECTED_PEOPLE,
  MAX_SELECTED_PEOPLE,
  PR_MERGE_PERIODS,
} from "@/constants/pr-merge-video"
import { useGithubStatus } from "@/hooks/use-github-status"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { parseRepoInput } from "@/lib/parse-repo"
import {
  PR_MERGE_VIDEO_DURATION_IN_FRAMES,
  PR_MERGE_VIDEO_FPS,
  PR_MERGE_VIDEO_HEIGHT,
  PR_MERGE_VIDEO_WIDTH,
} from "@/remotion/constants"
import { PrMergeVideo } from "@/remotion/pr-merge-video"
import type {
  PrMergePeriodDays,
  PrMergeVideoInputProps,
  RepoPrMergeData,
} from "@/types/pr-merge-video"

export function MergePreview() {
  const [repoParam] = useQueryState("repo")
  const [days, setDays] = useState<PrMergePeriodDays>(
    DEFAULT_PR_MERGE_PERIOD_DAYS
  )
  const [result, setResult] = useState<{
    key: string
    data: RepoPrMergeData | null
  } | null>(null)
  const [selectedLogins, setSelectedLogins] = useState<string[]>([])
  const [isRendering, setIsRendering] = useState(false)
  const { connected, login: githubLogin } = useGithubStatus()
  const prefersReducedMotion = usePrefersReducedMotion()

  const requestKey = useMemo(() => {
    if (!connected || !repoParam) {
      return null
    }
    const parsedRepo = parseRepoInput(repoParam)
    return parsedRepo
      ? `${parsedRepo.owner}/${parsedRepo.repo}:${days}:${githubLogin ?? "connected"}`
      : null
  }, [connected, repoParam, days, githubLogin])
  const data = result?.key === requestKey ? result.data : null
  const isLoading = requestKey !== null && result?.key !== requestKey

  useEffect(() => {
    if (!requestKey || !repoParam) {
      return
    }
    const parsedRepo = parseRepoInput(repoParam)
    if (!parsedRepo) {
      return
    }

    const controller = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(
          `/api/repo?owner=${encodeURIComponent(parsedRepo.owner)}&repo=${encodeURIComponent(parsedRepo.repo)}&days=${days}`,
          { signal: controller.signal }
        )
        if (controller.signal.aborted) {
          return
        }
        if (response.ok) {
          const json: RepoPrMergeData = await response.json()
          if (controller.signal.aborted) {
            return
          }
          setResult({ key: requestKey, data: json })
          setSelectedLogins(
            json.people
              .slice(0, DEFAULT_SELECTED_PEOPLE)
              .map((person) => person.login)
          )
        } else {
          const json: { error?: string } = await response
            .json()
            .catch(() => ({}))
          if (controller.signal.aborted) {
            return
          }
          setResult({ key: requestKey, data: null })
          setSelectedLogins([])
          toast.error(json.error ?? "Could not load that repository.")
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data: null })
          setSelectedLogins([])
          toast.error("Unable to load that repository. Try again.")
        }
      }
    })()

    return () => controller.abort()
  }, [repoParam, requestKey, days])

  const inputProps = useMemo<PrMergeVideoInputProps | null>(() => {
    if (!data) {
      return null
    }
    const selected = new Set(selectedLogins)
    const people = data.people.filter((person) => selected.has(person.login))
    if (people.length === 0) {
      return null
    }
    return {
      owner: data.owner,
      repo: data.repo,
      days,
      people,
    }
  }, [data, days, selectedLogins])

  const togglePerson = (login: string) => {
    if (selectedLogins.includes(login)) {
      setSelectedLogins(
        selectedLogins.filter((selectedLogin) => selectedLogin !== login)
      )
      return
    }
    if (selectedLogins.length >= MAX_SELECTED_PEOPLE) {
      toast.error(`Choose up to ${MAX_SELECTED_PEOPLE} people.`)
      return
    }
    setSelectedLogins([...selectedLogins, login])
  }

  const onDownload = async () => {
    if (!inputProps) {
      return
    }
    setIsRendering(true)
    const pending = toast.loading(
      "Rendering your video. This can take a minute."
    )
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputProps),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${inputProps.owner}-${inputProps.repo}-pr-merges.mp4`
        link.click()
        URL.revokeObjectURL(url)
        toast.success("Video ready.", { id: pending })
      } else {
        const json: { error?: string } = await response.json().catch(() => ({}))
        toast.error(json.error ?? "Could not render the video.", {
          id: pending,
        })
      }
    } catch {
      toast.error("Unable to render the video. Try again.", { id: pending })
    }
    setIsRendering(false)
  }

  const onPeriodChange = (groupValue: string[]) => {
    const next = Number(groupValue[0])
    if (next === 3 || next === 7 || next === 14) {
      setDays(next)
    }
  }

  const selectedMergeCount = inputProps
    ? inputProps.people.reduce((total, person) => total + person.merges, 0)
    : 0
  const emptyPreviewMessage = data?.people.length
    ? "Select at least one person to preview and download the video."
    : data
      ? "No people with merged pull requests were found for this time range."
      : "Enter a repository above to build its PR merge video."

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-1 gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl bg-card shadow-[0_0_0_0.0625rem_#1E1E1E14,0_0.0625rem_0.125rem_#28282814] dark:shadow-[0_0_0_0.0625rem_#FFFFFF14]">
        <div className="flex shrink-0 flex-col gap-2.5 px-4 pt-4 pb-3.5">
          <p className="font-display text-sm font-semibold tracking-tight">
            Time range
          </p>
          <ToggleGroup
            aria-label="Time range"
            className="w-full"
            onValueChange={onPeriodChange}
            size="sm"
            spacing={0}
            value={[String(days)]}
            variant="outline"
          >
            {PR_MERGE_PERIODS.map((period) => (
              <ToggleGroupItem
                className="flex-1"
                key={period}
                value={String(period)}
              >
                {period} days
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="h-px shrink-0 bg-border" />

        <div className="flex min-h-0 flex-1 flex-col px-4 pt-3.5 pb-3">
          {data?.people.length ? (
            <PeoplePicker
              maxSelected={MAX_SELECTED_PEOPLE}
              onToggle={togglePerson}
              people={data.people}
              selectedLogins={selectedLogins}
              truncated={data.truncated}
            />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <h2 className="font-display text-sm font-semibold tracking-tight">
                Choose people
              </h2>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 py-6 text-center">
                <span className="flex -space-x-2">
                  {[0, 1, 2].map((slot) => (
                    <span
                      className="size-7 rounded-full bg-brand-wash ring-2 ring-card"
                      key={slot}
                    />
                  ))}
                </span>
                <p className="max-w-[14rem] text-xs leading-relaxed text-pretty text-muted-foreground">
                  {isLoading
                    ? "Loading contributors…"
                    : "Analyze a repository to pick up to " +
                      MAX_SELECTED_PEOPLE +
                      " people for the video."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="h-px shrink-0 bg-border" />

        <div className="flex shrink-0 flex-col gap-2 px-4 pt-3.5 pb-4">
          <Button
            className="cta-gradient-primary h-11 w-full rounded-full border-0 font-display text-[0.9375rem] font-medium tracking-[-0.01em] hover:bg-transparent active:scale-[0.97]"
            disabled={!inputProps || isRendering}
            onClick={onDownload}
            size="lg"
          >
            <DownloadIcon />
            {isRendering ? "Rendering" : "Download MP4"}
          </Button>
          <p className="text-center text-xs text-muted-foreground tabular-nums">
            {inputProps
              ? selectedMergeCount.toLocaleString("en-US") +
                " merges · " +
                inputProps.owner +
                "/" +
                inputProps.repo
              : "1080 × 1080 · 16 s · MP4"}
          </p>
        </div>
      </aside>

      <div className="grid h-[min(42svh,100%)] min-h-0 min-w-0 overflow-hidden [container-type:size] lg:h-full">
        <div
          className="place-self-center overflow-hidden rounded-3xl bg-brand-wash p-2 shadow-[0_0_0_0.0625rem_#1E1E1E14] dark:shadow-[0_0_0_0.0625rem_#FFFFFF1A]"
          style={{
            width: "min(100cqw, 100cqh)",
            height: "min(100cqw, 100cqh)",
          }}
        >
          <div className="h-full overflow-hidden rounded-[calc(var(--radius-3xl)-0.5rem)] bg-background shadow-[0_0_0_0.0625rem_#1E1E1E14,0_0.0625rem_0.125rem_#28282814] dark:shadow-[0_0_0_0.0625rem_#FFFFFF14]">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : null}

            {!isLoading && inputProps ? (
              <Player
                acknowledgeRemotionLicense
                autoPlay={!prefersReducedMotion}
                className="!h-full !w-full"
                component={PrMergeVideo}
                compositionHeight={PR_MERGE_VIDEO_HEIGHT}
                compositionWidth={PR_MERGE_VIDEO_WIDTH}
                controls
                durationInFrames={PR_MERGE_VIDEO_DURATION_IN_FRAMES}
                fps={PR_MERGE_VIDEO_FPS}
                initiallyMuted
                inputProps={inputProps}
                key={`${data?.id}-${days}-${selectedLogins.join("-")}`}
                loop={!prefersReducedMotion}
              />
            ) : null}

            {!(isLoading || inputProps) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                <NotraMark className="size-9 text-brand-ink" />
                <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                  {emptyPreviewMessage}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
