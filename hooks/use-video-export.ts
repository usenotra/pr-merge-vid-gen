"use client"

import { useEffect, useRef, useState } from "react"

import { ensurePrMergeFonts } from "@/remotion/load-fonts"
import { PrMergeVideo } from "@/remotion/pr-merge-video"
import {
  PR_MERGE_VIDEO_WIDTH,
  PR_MERGE_VIDEO_HEIGHT,
  PR_MERGE_VIDEO_FPS,
  PR_MERGE_VIDEO_DURATION_IN_FRAMES,
} from "@/remotion/constants"
import type { PrMergeVideoInputProps } from "@/types/pr-merge-video"

export function useVideoExport() {
  const [renderState, setRenderState] = useState<"idle" | "rendering" | "done">(
    "idle"
  )
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(
    () => () => {
      controllerRef.current?.abort()
    },
    []
  )

  async function download(inputProps: PrMergeVideoInputProps) {
    if (controllerRef.current) return
    const controller = new AbortController()
    controllerRef.current = controller
    setRenderState("rendering")
    setProgress(0)
    setError(null)
    setIsCancelling(false)
    try {
      const { canRenderMediaOnWeb, renderMediaOnWeb } =
        await import("@remotion/web-renderer")
      controller.signal.throwIfAborted()
      const support = await canRenderMediaOnWeb({
        width: PR_MERGE_VIDEO_WIDTH,
        height: PR_MERGE_VIDEO_HEIGHT,
        container: "mp4",
        videoCodec: "h264",
        muted: true,
      })
      if (!support.canRender) {
        throw new Error(
          "This browser cannot export MP4 on this device. Try an up-to-date Chrome, Safari or Firefox browser."
        )
      }
      await ensurePrMergeFonts()
      controller.signal.throwIfAborted()
      const result = await renderMediaOnWeb({
        composition: {
          component: PrMergeVideo,
          id: "PrMergeVideo",
          width: PR_MERGE_VIDEO_WIDTH,
          height: PR_MERGE_VIDEO_HEIGHT,
          fps: PR_MERGE_VIDEO_FPS,
          durationInFrames: PR_MERGE_VIDEO_DURATION_IN_FRAMES,
          defaultProps: inputProps,
        },
        inputProps,
        container: "mp4",
        videoCodec: "h264",
        muted: true,
        pageResponsiveness: "high",
        signal: controller.signal,
        onProgress: ({ progress: next }) => {
          if (!controller.signal.aborted) setProgress(Math.floor(next * 100))
        },
      })
      const blob = await result.getBlob()
      controller.signal.throwIfAborted()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${inputProps.owner}-${inputProps.repo}-pr-merges.mp4`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      setRenderState("done")
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not export the video. Please try again."
        )
        setRenderState("idle")
      }
    } finally {
      controllerRef.current = null
      if (controller.signal.aborted) setRenderState("idle")
      setIsCancelling(false)
    }
  }

  function cancel() {
    controllerRef.current?.abort()
    setIsCancelling(true)
  }

  return { renderState, progress, error, download, cancel, isCancelling }
}
