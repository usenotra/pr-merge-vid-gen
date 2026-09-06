import { MAX_CONCURRENT_RENDERS } from "@/constants/render"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { bundle } from "@remotion/bundler"
import {
  ensureBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer"

import { VIDEO_CRF, VIDEO_X264_PRESET } from "@/constants/render"
import { webpackOverride } from "@/remotion/webpack-override"
import type { PrMergeVideoInputProps } from "@/types/pr-merge-video"

export class RenderBusy extends Error {
  readonly kind = "busy" as const
}

let activeRenders = 0
let serveUrlPromise: Promise<string> | null = null

function bundleComposition(): Promise<string> {
  return bundle({
    entryPoint: join(process.cwd(), "remotion/index.ts"),
    publicDir: join(process.cwd(), "public"),
    webpackOverride,
  })
}

function getServeUrl(): Promise<string> {
  if (process.env.NODE_ENV !== "production") {
    return bundleComposition()
  }
  if (!serveUrlPromise) {
    serveUrlPromise = bundleComposition()
    serveUrlPromise.catch(() => {
      serveUrlPromise = null
    })
  }
  return serveUrlPromise
}

export async function renderPrMergeVideo(
  inputProps: PrMergeVideoInputProps
): Promise<Buffer> {
  if (activeRenders >= MAX_CONCURRENT_RENDERS) {
    throw new RenderBusy("The renderer is busy. Please try again shortly.")
  }
  activeRenders += 1

  try {
    const [, serveUrl] = await Promise.all([ensureBrowser(), getServeUrl()])

    const composition = await selectComposition({
      serveUrl,
      id: "PrMergeVideo",
      inputProps,
    })

    const dir = await mkdtemp(join(tmpdir(), "pr-merge-video-"))
    const outputLocation = join(dir, "pr-merge-video.mp4")

    try {
      await renderMedia({
        composition,
        serveUrl,
        codec: "h264",
        imageFormat: "png",
        crf: VIDEO_CRF,
        x264Preset: VIDEO_X264_PRESET,
        outputLocation,
        inputProps,
      })
      return await readFile(outputLocation)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  } finally {
    activeRenders -= 1
  }
}
