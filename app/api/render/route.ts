import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { GITHUB_CONNECTION_REQUIRED_MESSAGE } from "@/lib/github-cookies"
import { readGithubToken } from "@/lib/github-oauth"
import { isRateLimited } from "@/lib/ratelimit"
import { RenderBusy, renderPrMergeVideo } from "@/lib/render"
import { prMergeVideoInputSchema } from "@/schemas/pr-merge-video"

export const runtime = "nodejs"
export const maxDuration = 300

export async function POST(request: NextRequest) {
  if (!readGithubToken(request)) {
    return NextResponse.json(
      { error: GITHUB_CONNECTION_REQUIRED_MESSAGE },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
  }

  const parsed = prMergeVideoInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    )
  }

  if (isRateLimited(request, "render")) {
    return NextResponse.json(
      { error: "Too many render requests. Please try again shortly." },
      { status: 429 }
    )
  }

  const filename = `${parsed.data.owner}-${parsed.data.repo}-pr-merges.mp4`

  try {
    const video = await renderPrMergeVideo(parsed.data)
    return new NextResponse(new Uint8Array(video), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    if (error instanceof RenderBusy) {
      return NextResponse.json(
        { error: "Too many render requests. Please try again shortly." },
        { status: 429 }
      )
    }
    console.error("Failed to render PR merge video", error)
    return NextResponse.json(
      { error: "Failed to render the video. Please try again." },
      { status: 500 }
    )
  }
}
