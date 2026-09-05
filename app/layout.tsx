import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"

import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const satoshi = localFont({
  src: [{ path: "../public/fonts/Satoshi-Variable.woff2", weight: "300 900" }],
  variable: "--font-satoshi",
  display: "swap",
})

const title = "PR merge video by Notra"
const description =
  "Turn a GitHub repository's recent pull request merges into an animated leaderboard and downloadable MP4."

export const viewport: Viewport = {
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#131319", media: "(prefers-color-scheme: dark)" },
  ],
}

export const metadata: Metadata = {
  title,
  description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={cn(
        "font-sans antialiased [font-synthesis:none]",
        inter.variable,
        satoshi.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="font-normal">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
          href="#content"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
