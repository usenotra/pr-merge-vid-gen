import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@remotion/bundler", "@remotion/renderer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
}

export default nextConfig
