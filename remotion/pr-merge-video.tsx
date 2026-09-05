import { AbsoluteFill } from "remotion"

import type { PrMergeVideoInputProps } from "@/types/pr-merge-video"

import {
  VIDEO_COLOR_BACKGROUND,
  VIDEO_COLOR_INK,
  VIDEO_COLOR_MUTED,
  VIDEO_FONT_DISPLAY,
  VIDEO_FONT_SANS,
} from "./constants"
import { ensurePrMergeFonts } from "./load-fonts"
import { MergeRow } from "./merge-row"
import { VideoNotraMark } from "./notra-mark"

ensurePrMergeFonts()

export function PrMergeVideo({
  owner,
  repo,
  days,
  people,
}: PrMergeVideoInputProps) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: VIDEO_COLOR_BACKGROUND,
        fontFamily: VIDEO_FONT_SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 62,
          left: 70,
          right: 70,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 40,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: VIDEO_COLOR_INK,
              fontFamily: VIDEO_FONT_DISPLAY,
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
            }}
          >
            Pull requests merged in the past {days} days
          </div>
          <div
            style={{
              color: VIDEO_COLOR_MUTED,
              fontSize: 22,
              fontWeight: 500,
              marginTop: 14,
              letterSpacing: "-0.01em",
            }}
          >
            {owner}/{repo}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          <VideoNotraMark size={44} />
          <div
            style={{
              color: VIDEO_COLOR_INK,
              fontFamily: VIDEO_FONT_DISPLAY,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Notra
          </div>
        </div>
      </div>

      {people.map((person, index) => (
        <MergeRow
          fontFamily={VIDEO_FONT_SANS}
          index={index}
          key={person.login}
          person={person}
          total={people.length}
        />
      ))}
    </AbsoluteFill>
  )
}
