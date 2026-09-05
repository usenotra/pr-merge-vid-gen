export function isAllowedAvatarUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (
      url.protocol === "https:" &&
      (url.hostname === "githubusercontent.com" ||
        url.hostname.endsWith(".githubusercontent.com"))
    )
  } catch {
    return false
  }
}
