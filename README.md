## Supabase setup

The application expects a `share_tokens` table for managing read-only sharing links. You can create it in your Supabase project with the following SQL:

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

If you prefer using the Supabase dashboard:

1. Navigate to **SQL Editor → New query**.
2. Paste the script above and click **Run**.
3. Confirm the new table appears under **Table editor → public → share_tokens**.

Make sure your service role or anon key used by the app has `select`, `insert`, and `update` access to `public.share_tokens` through Row Level Security policies.
