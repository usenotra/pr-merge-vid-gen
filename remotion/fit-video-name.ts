import { VIDEO_FONT_DISPLAY } from "./constants"

export function fitVideoName(name: string): string {
  const context = document.createElement("canvas").getContext("2d")
  if (!context) return name
  context.font = `600 34px ${VIDEO_FONT_DISPLAY}`
  context.letterSpacing = "-1.36px"
  if (context.measureText(name).width <= 264) return name
  const characters = Array.from(name)
  while (
    characters.length &&
    context.measureText(`${characters.join("")}…`).width > 264
  ) {
    characters.pop()
  }
  return `${characters.join("")}…`
}
