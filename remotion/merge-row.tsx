import { useMemo } from "react"

import { Img, useCurrentFrame, useVideoConfig } from "remotion"
import { fitVideoName } from "./fit-video-name"

import type { PrMergeRowProps } from "@/types/pr-merge-video"

import {
  BALL_DIAMETER,
  BALL_SPEED_PER_MERGE,
  BALL_TRACK_LEFT,
  BALL_TRACK_RIGHT,
  LABEL_LEFT,
  MAX_ROW_HEIGHT,
  PR_MERGE_VIDEO_HEIGHT,
  ROWS_BOTTOM,
  ROWS_TOP,
  VIDEO_COLOR_INK,
  VIDEO_COLOR_LAVENDER,
  VIDEO_COLOR_MUTED,
  VIDEO_FONT_DISPLAY,
} from "@/constants/video-composition"

export function MergeRow({
  person,
  index,
  total,
  fontFamily,
}: PrMergeRowProps) {
  const displayName = useMemo(
    () => fitVideoName(person.name || person.login),
    [person.name, person.login]
  )
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const rowHeight = Math.min(
    MAX_ROW_HEIGHT,
    (PR_MERGE_VIDEO_HEIGHT - ROWS_TOP - ROWS_BOTTOM) / total
  )
  const centerY = ROWS_TOP + rowHeight * (index + 0.5)
  const diameter = Math.min(BALL_DIAMETER, rowHeight - 12)
  const radius = diameter / 2
  const trackLeft = BALL_TRACK_LEFT + radius
  const trackRight = BALL_TRACK_RIGHT - radius
  const travelDistance = trackRight - trackLeft
  const distance = (frame / fps) * person.merges * BALL_SPEED_PER_MERGE
  const bounceProgress = distance % (travelDistance * 2)
  const centerX =
    trackLeft +
    (bounceProgress <= travelDistance
      ? bounceProgress
      : travelDistance * 2 - bounceProgress)

  return (
    <div style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: centerY,
          left: LABEL_LEFT,
          width: 270,
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            color: VIDEO_COLOR_INK,
            fontFamily: VIDEO_FONT_DISPLAY,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            overflow: "hidden",
            paddingBottom: "0.08em",
            paddingRight: "0.08em",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            color: VIDEO_COLOR_MUTED,
            fontSize: 21,
            fontWeight: 500,
            lineHeight: 1.25,
            marginTop: 9,
          }}
        >
          {person.merges.toLocaleString("en-US")}{" "}
          {person.merges === 1 ? "merge" : "merges"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          width: diameter + 10,
          height: diameter + 10,
          borderRadius: "50%",
          overflow: "hidden",
          transform: "translate(-50%, -50%)",
          backgroundColor: `${VIDEO_COLOR_INK}1a`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: "50%",
            backgroundColor: VIDEO_COLOR_LAVENDER,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 5,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Img
            src={person.avatarUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  )
}
