import { Composition } from "remotion"

import { prMergeVideoInputSchema } from "@/schemas/pr-merge-video"

import {
  DEFAULT_PR_MERGE_VIDEO_PROPS,
  PR_MERGE_VIDEO_DURATION_IN_FRAMES,
  PR_MERGE_VIDEO_FPS,
  PR_MERGE_VIDEO_HEIGHT,
  PR_MERGE_VIDEO_WIDTH,
} from "./constants"
import { PrMergeVideo } from "./pr-merge-video"

export function RemotionRoot() {
  return (
    <Composition
      component={PrMergeVideo}
      defaultProps={DEFAULT_PR_MERGE_VIDEO_PROPS}
      durationInFrames={PR_MERGE_VIDEO_DURATION_IN_FRAMES}
      fps={PR_MERGE_VIDEO_FPS}
      height={PR_MERGE_VIDEO_HEIGHT}
      id="PrMergeVideo"
      schema={prMergeVideoInputSchema}
      width={PR_MERGE_VIDEO_WIDTH}
    />
  )
}
