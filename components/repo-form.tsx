"use client"

import { type FormEvent, useState } from "react"
import { useQueryState } from "nuqs"
import { toast } from "sonner"

import { GitHubMark } from "@/components/github-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_REPO_INPUT } from "@/constants/pr-merge-video"
import { useGithubStatus } from "@/hooks/use-github-status"
import { buildGithubConnectHref } from "@/lib/github-connection"
import { parseRepoInput } from "@/lib/parse-repo"

export function RepoForm() {
  const [repoParam, setRepoParam] = useQueryState("repo")
  const [value, setValue] = useState(repoParam ?? DEFAULT_REPO_INPUT)
  const { connected, oauthConfigured, loaded, login } = useGithubStatus()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsed = parseRepoInput(value)
    if (!parsed) {
      toast.error("Enter a repo as owner/name or a GitHub URL.")
      return
    }
    const repoId = `${parsed.owner}/${parsed.repo}`.toLowerCase()
    if (!connected) {
      if (oauthConfigured) {
        window.location.assign(buildGithubConnectHref(repoId))
        return
      }
      toast.error(
        "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, or GITHUB_TOKEN for local use."
      )
      return
    }
    setRepoParam(repoId)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={onSubmit}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Label
            className="text-brand-ink/80 dark:text-white/80"
            htmlFor="repo"
          >
            Repository
          </Label>
          <div className="relative">
            <Input
              autoComplete="off"
              className="h-11 rounded-full border-brand-ink/10 bg-white/80 pr-4 pl-10 text-base shadow-[0_0.0625rem_0.125rem_#28282814] backdrop-blur-[0.15rem] md:text-base dark:border-white/10 dark:bg-white/10"
              id="repo"
              onChange={(event) => setValue(event.target.value)}
              placeholder="vercel/next.js"
              spellCheck={false}
              value={value}
            />
            <GitHubMark className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-brand-ink/60 dark:text-white/60" />
          </div>
        </div>
        <Button
          className="cta-gradient-primary h-11 shrink-0 rounded-full border-0 px-6 font-display text-[0.9375rem] font-medium tracking-[-0.01em] hover:bg-transparent active:scale-[0.97]"
          disabled={!loaded}
          size="lg"
          type="submit"
        >
          {loaded && oauthConfigured && !connected
            ? "Connect GitHub"
            : "Analyze merges"}
        </Button>
      </form>
      {login ? (
        <p className="flex items-center gap-2 text-xs text-brand-ink/60 dark:text-white/60">
          <span className="truncate">{login}</span>
          <Button
            className="h-auto px-0 text-xs"
            nativeButton={false}
            render={<a href="/api/github/logout" />}
            size="sm"
            variant="link"
          >
            Disconnect
          </Button>
        </p>
      ) : null}
    </div>
  )
}
