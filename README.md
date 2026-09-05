# PR merge video

Turn a public GitHub repository's recent pull request merges into an animated leaderboard and a downloadable MP4.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

### GitHub access

Use either:

1. A [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) with callback `http://localhost:3000/api/github/callback`, then set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
2. A personal `GITHUB_TOKEN` for local use when OAuth is not configured.

Set `NEXT_PUBLIC_SITE_URL` to the public origin in production.

## Scripts

- `npm run dev` — Next.js app
- `npm run studio` — Remotion studio for the composition
- `npm run typecheck` — TypeScript
