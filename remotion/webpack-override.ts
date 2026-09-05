import path from "node:path"

import type { WebpackOverrideFn } from "@remotion/bundler"

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        "@": path.join(process.cwd()),
      },
    },
  }
}
