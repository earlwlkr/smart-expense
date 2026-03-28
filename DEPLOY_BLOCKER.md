# Deploy Blocker

Date: 2026-03-08
Repository: `smart-expense`

## Why production deploy could not be triggered from this environment

1. Package install could not complete due network DNS failures to npm registry.
   - Command: `CI=true pnpm install`
   - Error: `getaddrinfo EAI_AGAIN registry.npmjs.org`

2. Repository lint does not pass on current `main` due pre-existing Biome issues unrelated to this change.
   - Command: `pnpm lint`
   - Result: 51 errors across existing files (examples include `noExplicitAny`, a11y, and style rules).

3. `next build` with default Turbopack is blocked in this sandbox by OS restrictions.
   - Command: `pnpm build`
   - Error includes: `creating new process`, `binding to a port`, `Operation not permitted (os error 1)`

4. Vercel CLI is not available in this environment, and network restrictions also prevent installation.
   - Command: `which vercel`
   - Result: not found

## Notes about this change

- The code change was kept production-safe and minimal:
  - Hardened `/api/route` request validation and upstream timeout handling.
  - Removed `next/font/google` runtime fetch dependency from root layout to reduce build-time network fragility.

## What to run in a normal CI/CD or local dev environment

1. `pnpm install`
2. `pnpm lint`
3. `pnpm build`
4. `vercel --prod --yes`
