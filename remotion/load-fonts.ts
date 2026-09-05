import { loadFont } from "@remotion/fonts"
import { staticFile } from "remotion"

const INTER_WEIGHTS = ["400", "600"] as const

let started = false

export function ensurePrMergeFonts(): void {
  if (started || typeof FontFace === "undefined") {
    return
  }
  started = true

  for (const weight of INTER_WEIGHTS) {
    loadFont({
      family: "Inter",
      url: staticFile(`fonts/inter-${weight}.woff2`),
      weight,
      format: "woff2",
    })
  }

  loadFont({
    family: "Satoshi",
    url: staticFile("fonts/Satoshi-Variable.woff2"),
    weight: "300 900",
    format: "woff2",
  })
}
