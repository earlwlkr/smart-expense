# smart-expense

Group expense tracking app for shared spending scenarios (trips, roommates, events).

Core capabilities:
- create groups and manage members
- add and categorize expenses
- split balances between members
- analytics view (category/member breakdown)
- share read-only group views via links

## Tech stack
- Next.js (App Router)
- React + TypeScript
- Convex (app data, auth, and realtime state)

## Required environment variables
Create `.env.local` with:

```env
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Optional (AI parsing endpoints used by API routes):

```env
AI_GATEWAY_API_KEY=
AI_GATEWAY_MODEL=openai/gpt-5.6-luna
```

## Run locally
```bash
pnpm install
pnpm dev
```

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm format`
- `pnpm check`
