# PR merge video

Turn a public GitHub repository's recent pull request merges into an animated leaderboard and a downloadable MP4.

## Setup

```bash
cp .env.example .env.local
bun install
bun dev
```

### GitHub access

Use either:

1. A [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) with callback `http://localhost:3000/api/github/callback`, then set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
2. A personal `GITHUB_TOKEN` for local use when OAuth is not configured.

Set `NEXT_PUBLIC_SITE_URL` to the public origin in production.

## Scripts

- `bun dev` — Next.js app
- `bun run studio` — Remotion studio for the composition
- `bun run typecheck` — TypeScript

## Browser export

MP4 export runs on the user's device using Remotion Web Renderer (1080 × 1080,
60 fps, 16 seconds, H.264, no audio). The renderer is loaded only when exporting.
The app checks codec support and offers progress and cancellation. Keep the tab
open until the download starts. No public server-render endpoint, render queue,
Sandbox or object storage is needed. Remotion Studio remains available locally.

## Vercel launch

1. Import the repository with the Next.js preset (`bun run build`).
2. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `NEXT_PUBLIC_SITE_URL`
   to the production HTTPS origin. Do not set the local `GITHUB_TOKEN` fallback.
3. Set the GitHub OAuth callback to `https://YOUR_DOMAIN/api/github/callback`.
   Use a separate OAuth app and stable callback domain for preview testing.
4. Configure a Vercel Firewall rate-limit rule for `/api/repo` before a public
   launch. The in-process limiter is best-effort only across serverless instances.
5. Verify login, a six-person export, long names, cancellation and download on
   your supported desktop/mobile browsers. MP4 codec support varies by device.
6. Include Remotion's render telemetry in the site's privacy disclosure and check
   the applicable Remotion license: https://www.remotion.dev/docs/telemetry.

The browser exports locally, but still fetches GitHub avatars and sends Remotion
render telemetry. No GitHub token is passed to the video renderer.
