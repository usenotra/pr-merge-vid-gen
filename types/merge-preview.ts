import type { RepoPrMergeData } from "@/types/pr-merge-video"
export type MergePreviewResult = {
  key: string
  data: RepoPrMergeData | null
}

export type RepoErrorResponse = { error?: string }
