import { SITE_METADATA, SITE_VIEWPORT } from "@/constants/site"
import type { ChildrenProps } from "@/types/layout"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"

import { Providers } from "@/components/providers"
import { Databuddy } from "@databuddy/sdk/react"
import { cn } from "cn"

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

export const viewport: Viewport = SITE_VIEWPORT

export const metadata: Metadata = SITE_METADATA

export default function RootLayout({ children }: Readonly<ChildrenProps>) {
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
        <Databuddy
          clientId="147f292e-271f-4088-a988-35a8f5e91031"
          disabled={process.env.NODE_ENV === "development"}
          trackWebVitals={true}
        />
      </body>
    </html>
  )
}
