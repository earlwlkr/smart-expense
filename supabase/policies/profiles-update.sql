-- Allow authenticated users to update their own profile rows.
-- Apply this policy in Supabase on the `public.profiles` table.
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
