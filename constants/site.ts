import type { Metadata, Viewport } from "next"

export const title = "PR merge video by Notra"
export const description =
  "Turn a GitHub repository's recent pull request merges into an animated leaderboard and downloadable MP4."

export const SITE_VIEWPORT: Viewport = {
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#131319", media: "(prefers-color-scheme: dark)" },
  ],
}

export const SITE_METADATA: Metadata = {
  title,
  description,
}
