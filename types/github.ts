export interface GithubOAuthState {
  state: string
  repo?: string
}

export interface GithubOAuthConfig {
  clientId: string
  clientSecret: string
}

export interface GithubStatus {
  connected: boolean
  login: string | null
  oauthConfigured: boolean
}

export type GithubStatusLoadState = { loaded: boolean }

export type GithubRepo = { owner: string; repo: string }
