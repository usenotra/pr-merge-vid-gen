export const GITHUB_HOSTS = new Set(["github.com", "www.github.com"])

export const SLUG_PART = /^[\w.-]+$/

export const GIT_SUFFIX = /\.git$/i

export const HAS_SCHEME = /^https?:\/\//i

export const CONTAINS_GITHUB_PATH = /(^|\.)github\.com\//i

export const SSH_GITHUB =
  /^(?:ssh:\/\/)?git@github\.com[:/]([^/\s]+)\/([^/\s]+)$/i

export const REPO_SLUG = /^[\w.-]+$/

export const REPO_PAIR = /^[\w.-]{1,100}\/[\w.-]{1,100}$/
