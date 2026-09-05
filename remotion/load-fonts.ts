import { staticFile } from "remotion"

let fontsPromise: Promise<void> | null = null

export function ensurePrMergeFonts(): Promise<void> {
  if (typeof FontFace === "undefined") return Promise.resolve()
  if (!fontsPromise) {
    const fonts = [
      new FontFace("Inter", `url("${staticFile("fonts/inter-400.woff2")}")`, {
        weight: "400",
      }),
      new FontFace("Inter", `url("${staticFile("fonts/inter-600.woff2")}")`, {
        weight: "600",
      }),
      new FontFace(
        "Satoshi",
        `url("${staticFile("fonts/Satoshi-Variable.woff2")}")`,
        { weight: "300 900" }
      ),
    ]
    fontsPromise = Promise.all(
      fonts.map(async (font) => {
        await font.load()
        document.fonts.add(font)
      })
    )
      .then(() => undefined)
      .catch((error) => {
        fontsPromise = null
        throw error
      })
  }
  return fontsPromise
}
