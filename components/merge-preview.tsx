"use client"

import type {
  MergePreviewResult,
  RepoErrorResponse,
} from "@/types/merge-preview"

import { SKELETON_ROWS } from "@/constants/merge-preview"

import { Player } from "@remotion/player"
import {
  ArrowLeftIcon,
  CheckIcon,
  DownloadIcon,
  LoaderCircleIcon,
  PlayIcon,
  XIcon,
} from "lucide-react"
import { useQueryState } from "nuqs"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { NotraMark } from "@/components/notra-mark"
import { PeoplePicker } from "@/components/people-picker"
import { SwapLabel } from "@/components/swap-label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { CTA_BUTTON_CLASS } from "@/constants/cta"
import {
  DEFAULT_PR_MERGE_PERIOD_DAYS,
  DEFAULT_SELECTED_PEOPLE,
  MAX_SELECTED_PEOPLE,
  PR_MERGE_PERIODS,
} from "@/constants/pr-merge-video"
import {
  PR_MERGE_VIDEO_DURATION_IN_FRAMES,
  PR_MERGE_VIDEO_FPS,
  PR_MERGE_VIDEO_HEIGHT,
  PR_MERGE_VIDEO_WIDTH,
} from "@/constants/video-composition"
import { useGithubStatus } from "@/hooks/use-github-status"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { useVideoExport } from "@/hooks/use-video-export"
import { formatPeriodLong } from "@/lib/format-period"
import { parseRepoInput } from "@/lib/parse-repo"
import { setRepoLoading } from "@/lib/repo-loading-store"
import { PrMergeVideo } from "@/remotion/pr-merge-video"
import type {
  PrMergePeriodDays,
  PrMergeVideoInputProps,
  RepoPrMergeData,
} from "@/types/pr-merge-video"
import { cn } from "cn"

export function MergePreview() {
  const [showDemo, setShowDemo] = useState(false)
  const [repoParam] = useQueryState("repo")
  const [days, setDays] = useState<PrMergePeriodDays>(
    DEFAULT_PR_MERGE_PERIOD_DAYS
  )
  const [result, setResult] = useState<MergePreviewResult | null>(null)
  const [selectedLogins, setSelectedLogins] = useState<string[]>([])
  const {
    renderState,
    progress,
    error: exportError,
    download,
    cancel,
    isCancelling,
  } = useVideoExport()
  const isRendering = renderState === "rendering"
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
    setRepoLoading(isLoading)
    return () => setRepoLoading(false)
  }, [isLoading])

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
          const json: RepoErrorResponse = await response
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

  const onPeriodChange = (next: PrMergePeriodDays | null) => {
    if (next !== null) {
      setDays(next)
    }
  }

  const periodItems = PR_MERGE_PERIODS.map((period) => ({
    value: period,
    label: formatPeriodLong(period),
  }))

  const selectedMergeCount = inputProps
    ? inputProps.people.reduce((total, person) => total + person.merges, 0)
    : 0
  const emptyPreviewMessage = data?.people.length
    ? "Select at least one person to preview and download the video."
    : data
      ? "No people with merged pull requests were found for this time range."
      : "Enter a repository above to build its PR merge video."

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-1 gap-5 wide:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="flex min-h-0 min-w-0 flex-col gap-6">
        <div className="flex h-8 shrink-0 items-center justify-between gap-3">
          <p className="font-display text-sm font-semibold tracking-tight">
            Time range
          </p>
          <Select
            items={periodItems}
            onValueChange={onPeriodChange}
            value={days}
          >
            <SelectTrigger
              aria-label="Time range"
              className="h-7 min-w-28 gap-1 rounded-full border-border bg-background pr-1.5 pl-2.5 text-[0.8125rem] font-medium [&_svg]:size-3.5"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="end"
              alignItemWithTrigger={false}
              className="min-w-36 rounded-xl p-1 duration-100 ease-out motion-reduce:animate-none data-open:zoom-in-[0.98] data-closed:zoom-out-[0.98]"
              sideOffset={6}
            >
              {PR_MERGE_PERIODS.map((period) => (
                <SelectItem
                  className="rounded-lg py-1 text-[0.8125rem]"
                  key={period}
                  value={period}
                >
                  {formatPeriodLong(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
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
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex min-h-0 shrink flex-col gap-1.5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_95%)]",
                    isLoading && "motion-safe:animate-pulse"
                  )}
                >
                  {SKELETON_ROWS.map((row, index) => (
                    <div
                      className="flex items-center gap-2.5 rounded-lg bg-muted/40 p-2"
                      key={index}
                    >
                      <span className="size-8 shrink-0 rounded-full bg-muted" />
                      <span className="flex grow flex-col gap-1.5">
                        <span
                          className="h-2.5 rounded-full bg-muted"
                          style={{ width: row.name }}
                        />
                        <span
                          className="h-2 rounded-full bg-muted/70"
                          style={{ width: row.meta }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <p className="shrink-0 text-center text-xs text-muted-foreground">
                  {isLoading
                    ? "Loading contributors…"
                    : "No people to show yet"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <div className="flex items-center">
            <Button
              aria-busy={isRendering || undefined}
              className={cn(CTA_BUTTON_CLASS, "min-w-0 flex-1")}
              disabled={!inputProps || isRendering}
              onClick={() => inputProps && download(inputProps)}
              size="lg"
            >
              <SwapLabel
                sizers={[
                  <>
                    <DownloadIcon />
                    Download MP4
                  </>,
                  <>
                    <LoaderCircleIcon />
                    Rendering {progress}%
                  </>,
                ]}
                swapKey={renderState}
              >
                {renderState === "rendering" ? (
                  <>
                    <LoaderCircleIcon className="animate-spin" />
                    Rendering {progress}%
                  </>
                ) : renderState === "done" ? (
                  <>
                    <CheckIcon />
                    Download ready
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Download MP4
                  </>
                )}
              </SwapLabel>
            </Button>
            <div
              inert={!isRendering}
              aria-hidden={!isRendering}
              className={cn(
                "flex shrink-0 justify-end transition-[width,opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                isRendering
                  ? "w-14 translate-x-0 opacity-100"
                  : "pointer-events-none w-0 translate-x-2 opacity-0"
              )}
            >
              <Button
                aria-label={
                  isCancelling ? "Cancelling export" : "Cancel export"
                }
                aria-busy={isCancelling || undefined}
                title={isCancelling ? "Cancelling export" : "Cancel export"}
                className="export-cancel size-11 rounded-full border-0 text-[#ff656b] transition-[filter,transform] duration-150 ease-out hover:text-[#ff656b] active:scale-[0.96] active:not-aria-[haspopup]:translate-y-0 disabled:opacity-100 motion-reduce:transition-none"
                variant="ghost"
                size="icon"
                onClick={cancel}
                disabled={!isRendering || isCancelling}
              >
                <XIcon aria-hidden="true" className="size-5" />
              </Button>
            </div>
          </div>
          {exportError ? (
            <p role="alert" className="text-center text-xs text-destructive">
              {exportError}
            </p>
          ) : null}
          <span className="sr-only" role="status">
            {isCancelling
              ? "Cancelling export"
              : isRendering
                ? `Rendering video: ${progress}%`
                : renderState === "done"
                  ? "Video download ready"
                  : ""}
          </span>
          {inputProps ? (
            <p className="text-center text-xs text-muted-foreground tabular-nums">
              {selectedMergeCount.toLocaleString("en-US") +
                " merges · " +
                inputProps.owner +
                "/" +
                inputProps.repo}
            </p>
          ) : null}
        </div>
      </aside>

      <div className="[container-type:size] grid h-[min(42svh,100%)] min-h-0 min-w-0 overflow-hidden wide:h-full">
        <div
          className="place-self-center overflow-hidden rounded-3xl"
          style={{
            width: "min(100cqw, 100cqh)",
            height: "min(100cqw, 100cqh)",
          }}
        >
          <div className="h-full overflow-hidden rounded-3xl bg-background shadow-[0_0_0_0.0625rem_#1E1E1E1F,0_0.125rem_1.25rem_#1E1E1E0A] dark:shadow-[0_0_0_0.0625rem_#FFFFFF1F]">
            {showDemo ? (
              <div className="flex h-full flex-col">
                <div className="flex shrink-0 items-center justify-between gap-2 px-3 pt-3">
                  <Button
                    onClick={() => setShowDemo(false)}
                    size="sm"
                    variant="ghost"
                  >
                    <ArrowLeftIcon />
                    Back
                  </Button>
                  <p className="pr-2 text-xs text-muted-foreground">Demo</p>
                </div>
                <video
                  aria-label="Sample leaderboard: Jan with 200 merges and Dominik with 21"
                  autoPlay={!prefersReducedMotion}
                  className="min-h-0 w-full flex-1 bg-white object-contain"
                  controls
                  loop={!prefersReducedMotion}
                  muted
                  playsInline
                  preload="metadata"
                  src="/demo/pr-merge-demo.mp4"
                />
              </div>
            ) : null}

            {!showDemo && isLoading ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : null}

            {!showDemo && !isLoading && inputProps ? (
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

            {!(showDemo || isLoading || inputProps) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg p-1.5 dark:bg-white dark:shadow-[0_0_0_0.0625rem_#1E1E1E14]">
                  <NotraMark className="size-9 text-brand-ink" />
                </span>
                <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                  {emptyPreviewMessage}
                </p>
                <Button
                  onClick={() => setShowDemo(true)}
                  size="sm"
                  variant="outline"
                >
                  <PlayIcon />
                  Show demo
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
