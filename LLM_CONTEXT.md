# Smart Expense - LLM Context

This document provides technical context for LLMs working on this codebase.

## 1. Project Overview

**Smart Expense** is a shared expense tracking application built with **Next.js 15**, **Supabase**, and **AI-powered features**. It allows users to create groups, add expenses (manually or via AI parsing), and track balances.

## 2. Tech Stack

-   **Framework**: Next.js 15 (App Router, Turbopack)
-   **Language**: TypeScript 5.x (Strict mode)
-   **UI Library**: React 19, shadcn/ui (Radix UI + Tailwind)
-   **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
-   **Backend / DB**: Supabase (PostgreSQL, Auth, Realtime)
-   **State Management**: React Context + Custom Hooks
-   **Form Handling**: React Hook Form + Zod
-   **Linting & Formatting**: Biome (`biome.json`)
-   **Package Manager**: pnpm

## 3. Project Structure

```
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # API routes (e.g., expense parsing)
│   ├── groups/[id]/      # Group detail view
│   ├── login/            # Auth pages
│   └── page.tsx          # Homepage (Dashboard)
├── components/           # React components
│   ├── ui/               # shadcn/ui components (Do not modify logic)
│   ├── Expenses/         # Expense-related components (Forms, Lists)
│   ├── Groups/           # Group management components
│   └── ...
├── lib/                  # Core logic & utilities
│   ├── contexts/         # React Context Providers for global state
│   ├── db/               # Database query functions (per table)
│   │   ├── init.ts       # Client-side Supabase init
│   │   └── [entity].ts   # Entity-specific CRUD (e.g., expenses.ts)
│   ├── supabase/         # Supabase client configurations
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client (cookies)
│   │   └── middleware.ts # Auth middleware
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Helper functions (cn, etc.)
└── public/               # Static assets
```

## 4. Key Architecture Patterns

### Data Fetching & State
-   **Supabase Client**:
    -   Client Components: Import from `@/lib/db/init` (wraps standard client).
    -   Server Components: Import `createClient` from `@/lib/supabase/server`.
-   **Context Pattern**: Data is fetched in Context Providers (`lib/contexts/`) and exposed via custom hooks (e.g., `useExpenses()`).
-   **Provider Nesting**: Crucial order in `app/groups/[id]/page.tsx`:
    `CategoriesProvider` -> `MembersProvider` -> `ExpensesProvider` -> `TokensProvider`

### Database Schema (Supabase)
Tables:
-   `groups`: Shared expense groups.
-   `members`: Users belonging to a group.
-   `expenses`: Expense records.
-   `categories`: Expense categories.
-   `participants`: Many-to-many link between expenses and members (splits).
-   `share_tokens`: Read-only access links (see README SQL).
-   `profiles`: User metadata.

### Styling & UI
-   **shadcn/ui**: Components in `@/components/ui` are generated. Avoid manual edits unless necessary.
-   **Tailwind**: Use utility classes. Avoid arbitrary values `[123px]` where possible.

### AI Features
-   **Expense Parsing**: Natural language processing is handled in `/api/route.ts` using HuggingFace (DeepSeek V3) or OpenAI.

## 5. Coding Conventions

-   **Imports**: Use absolute imports with `@/`.
-   **Linting**: Run `pnpm check` (Biome) before committing.
-   **Formatting**: Double quotes, 2-space indentation.
-   **Types**: All Props and Data types must be explicitly defined in `lib/types.ts` or component files.

## 6. Common Tasks

-   **Add New Page**: Create `app/[route]/page.tsx`, add to `middleware.ts` if protected.
-   **Add Database Table**:
    1.  Create table in Supabase.
    2.  Add types to `database.types.ts` (or manual types).
    3.  Create `lib/db/[table].ts` for CRUD.
    4.  Create Context Provider if global state is needed.
