export const DITHER_MOBILE_QUERY = "(width < 640px)"
export const DITHER_MOBILE_MAX_PIXELS = 1_000_000
export const DITHER_VIEWPORT_MARGIN = "200px"
export const DITHER_IDLE_FALLBACK_MS = 1500

/** Brand dither preset shared by every Notra surface. */
export const NOTRA_DITHER_PRESET = {
  colorBack: "#00000000",
  colorFront: "#8B5CF633",
  scale: 0.53,
  shape: "wave",
  size: 2.9,
  speed: 0.53,
  type: "4x4",
} as const
