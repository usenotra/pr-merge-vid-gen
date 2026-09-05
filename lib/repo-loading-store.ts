import { useSyncExternalStore } from "react"

let isLoading = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setRepoLoading(next: boolean) {
  if (next === isLoading) {
    return
  }
  isLoading = next
  for (const listener of listeners) {
    listener()
  }
}

/** Whether the repository analysis request is currently in flight. */
export function useRepoLoading() {
  return useSyncExternalStore(
    subscribe,
    () => isLoading,
    () => false
  )
}
