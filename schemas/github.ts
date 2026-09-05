import * as z from "zod"

const REPO_SLUG = /^[\w.-]+$/
const REPO_PAIR = /^[\w.-]{1,100}\/[\w.-]{1,100}$/

function isAllowedAvatarUrl(value: string): boolean {
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

export const githubAvatarUrlSchema = z
  .url()
  .refine(isAllowedAvatarUrl, "Avatar URLs must be on githubusercontent.com.")

export const githubOwnerSlugSchema = z
  .string()
  .trim()
  .min(1, "Owner is required.")
  .max(100)
  .regex(REPO_SLUG, "Enter a valid GitHub owner.")

export const githubRepoSlugSchema = z
  .string()
  .trim()
  .min(1, "Repository is required.")
  .max(100)
  .regex(REPO_SLUG, "Enter a valid GitHub repository.")

export const githubReturnRepoSchema = z.string().trim().regex(REPO_PAIR)

export const MAX_PENDING_OAUTH_STATES = 5

const githubOAuthStateSchema = z.object({
  state: z.string().min(1),
  repo: githubReturnRepoSchema.optional(),
})

export const githubOAuthStatesSchema = z
  .array(githubOAuthStateSchema)
  .max(MAX_PENDING_OAUTH_STATES)

export const githubCallbackQuerySchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
})

export const githubAccessTokenSchema = z.object({
  access_token: z.string().min(1),
})

export const githubViewerSchema = z.object({
  login: z.string().min(1),
})
