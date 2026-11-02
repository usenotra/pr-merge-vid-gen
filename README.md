# PR merge video

Turn a GitHub repository's recent pull request merges into an animated leaderboard and a downloadable MP4.

## Setup

```bash
cp .env.example .env.local
bun install
bun dev
```

### GitHub access

Use either:

1. A [GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app) with callback `http://localhost:3000/api/github/callback`, webhooks off, and only the read-only **Pull requests** repository permission. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_APP_SLUG`. Public repos work after login; users install the app on the private repos they want to use.
2. A personal `GITHUB_TOKEN` for local use when OAuth is not configured.

Set `NEXT_PUBLIC_SITE_URL` to the public origin in production.

## Scripts

- `bun dev` — Next.js app
- `bun run studio` — Remotion studio for the composition
- `bun run typecheck` — TypeScript

## Browser export

The empty video preview's **Show demo** button plays `public/demo/pr-merge-demo.mp4`
in place without GitHub access; **Back** restores the preview. It uses fictional
counts: Jan Burzinski has 200 merges and Dominik K. has 21. Regenerate the
16-second demo with:

```bash
bunx remotion render PrMergeVideo public/demo/pr-merge-demo.mp4 --props=constants/demo-video.json
```

MP4 export runs on the user's device using Remotion Web Renderer (1080 × 1080,
60 fps, 16 seconds, H.264, no audio). The renderer is loaded only when exporting.
The app checks codec support and offers progress and cancellation. Keep the tab
open until the download starts. No public server-render endpoint, render queue,
Sandbox or object storage is needed. Remotion Studio remains available locally.

## Vercel launch

1. Import the repository with the Next.js preset (`bun run build`).
2. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_APP_SLUG`, and
   `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin. Do not set the local
   `GITHUB_TOKEN` fallback.
3. Set the GitHub App callback to `https://YOUR_DOMAIN/api/github/callback` and
   its setup URL to `https://YOUR_DOMAIN/`. Use a separate GitHub App and stable
   callback domain for preview testing.
4. Configure a Vercel Firewall rate-limit rule for `/api/repo` before a public
   launch. The in-process limiter is best-effort only across serverless instances.
5. Verify login, a six-person export, long names, cancellation and download on
   your supported desktop/mobile browsers. MP4 codec support varies by device.
6. Include Remotion's render telemetry in the site's privacy disclosure and check
   the applicable Remotion license: https://www.remotion.dev/docs/telemetry.

The browser exports locally, but still fetches GitHub avatars and sends Remotion
render telemetry. No GitHub token is passed to the video renderer.

## Code organization

- `types/`: TypeScript types and interfaces, grouped by domain.
- `schemas/`: runtime validation schemas.
- `constants/`: shared values and configuration, including UI variants and video composition settings.
- `lib/`: shared helpers and service logic; keep each file focused on one concern.
- `components/`, `hooks/`, `remotion/`, and `app/`: components, hooks, video features, and Next.js entry points.

Import directly from domain files without re-export barrels. Import `cn` directly from the `cn` package. Keep Next.js route exports and font initialization in their framework entry points.
