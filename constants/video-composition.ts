import type { PrMergeVideoInputProps } from "@/types/pr-merge-video"

export const PR_MERGE_VIDEO_WIDTH = 1080
export const PR_MERGE_VIDEO_HEIGHT = 1080
export const PR_MERGE_VIDEO_FPS = 60
export const PR_MERGE_VIDEO_DURATION_IN_FRAMES = 960

export const ROWS_TOP = 210
export const ROWS_BOTTOM = 40
export const MAX_ROW_HEIGHT = 180
export const LABEL_LEFT = 70
export const BALL_TRACK_LEFT = 350
export const BALL_TRACK_RIGHT = 1000
export const BALL_DIAMETER = 150
export const BALL_SPEED_PER_MERGE = 14.4

export const VIDEO_FONT_DISPLAY =
  'Satoshi, Inter, "Helvetica Neue", Arial, system-ui, sans-serif'
export const VIDEO_FONT_SANS =
  'Inter, "Helvetica Neue", Arial, system-ui, sans-serif'
export const VIDEO_COLOR_BACKGROUND = "#ffffff"
export const VIDEO_COLOR_INK = "#1e1e1e"
export const VIDEO_COLOR_MUTED = "#1e1e1ebf"
export const VIDEO_COLOR_LAVENDER = "#c8b2ee"
export const VIDEO_COLOR_WASH = "#c8b2ee40"
export const VIDEO_TRACK_HEIGHT = 6

export const DEFAULT_PR_MERGE_VIDEO_PROPS = {
  owner: "usenotra",
  repo: "notra",
  days: 7,
  people: [
    {
      login: "janburzinski",
      name: "Jan Burzinski",
      avatarUrl: "https://avatars.githubusercontent.com/u/156842394?v=4",
      merges: 65,
    },
    {
      login: "mezotv",
      name: "Dominik K.",
      avatarUrl: "https://avatars.githubusercontent.com/u/68947960?v=4",
      merges: 51,
    },
  ],
} satisfies PrMergeVideoInputProps
