import type { PrMergePeriodDays } from "@/types/pr-merge-video"

export function formatPeriodLong(days: PrMergePeriodDays): string {
  return days === 1 ? "Last 24 hours" : `Last ${days} days`
}

/** Sentence fragment for the video headline, e.g. "the past 7 days". */
export function formatPeriodPhrase(days: PrMergePeriodDays): string {
  return days === 1 ? "the past 24 hours" : `the past ${days} days`
}
