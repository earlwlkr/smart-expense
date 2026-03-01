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
- Convex (app data and realtime state)
- Supabase (share token storage)

## Required environment variables
Create `.env.local` with:

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Optional (AI parsing endpoints used by API routes):

```env
HF_API_KEY=
OPENAI_API_KEY=
```

## Supabase setup
The app expects a `share_tokens` table for read-only sharing links.

```sql
create table if not exists public.share_tokens (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  disabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz,
  constraint share_tokens_expires_after_creation
    check (expires_at is null or expires_at >= created_at)
);

create index if not exists share_tokens_group_id_idx on public.share_tokens (group_id);
create index if not exists share_tokens_active_idx on public.share_tokens (group_id, disabled, expires_at);
```

Make sure the key used by the app has `select`, `insert`, and `update` access to `public.share_tokens` through RLS policies.

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
