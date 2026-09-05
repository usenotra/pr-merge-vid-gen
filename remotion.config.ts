import { Config } from "@remotion/cli/config"

import { VIDEO_CRF, VIDEO_X264_PRESET } from "./constants/render"
import { webpackOverride } from "./remotion/webpack-override"

Config.setVideoImageFormat("jpeg")
Config.setCrf(VIDEO_CRF)
Config.setX264Preset(VIDEO_X264_PRESET)
Config.setOverwriteOutput(true)
Config.setEntryPoint("./remotion/index.ts")
Config.overrideWebpackConfig(webpackOverride)
