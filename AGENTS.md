<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Link Shortener — AGENTS.md

## Project Identity

A full-stack URL shortener built with the **Next.js 16 App Router**, **Clerk** for authentication, **Neon** (serverless PostgreSQL) via **Drizzle ORM**, and **shadcn/ui** on **Tailwind CSS v4**.

- **Package manager:** npm
- **Node:** ensure you're on a current LTS (>=20)
- **TypeScript:** strict mode enabled

---

## Architecture

```
Request → proxy.ts (Clerk auth) → app/ (Next.js App Router)
                                        ├── layout.tsx   (ClerkProvider, global header)
                                        ├── page.tsx     (home / link creator)
                                        └── api/         (API routes)
                                              └── ...

Database:  Neon PostgreSQL
           ↑ drizzle-orm/neon-http
           └── src/index.ts (db connection)
           └── src/db/schema.ts (Drizzle schema — to be created)
           └── drizzle/ (migrations output)
```

---

## Conventions

### File naming
- **Route handlers:** `src/app/api/**/route.ts` (App Router API routes)
- **Server components by default** — add `"use client"` only when you need interactivity, state, or browser APIs
- **Middlewares:** `src/proxy.ts` handles Clerk auth (do not rename to `middleware.ts` unless intentional)
- **Database:** `src/db/schema.ts` for Drizzle table definitions, `src/index.ts` for the Drizzle client

### Imports
- **Path alias** `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- **UI components** from `@/components/ui/<name>`
- **Clerk server APIs** from `@clerk/nextjs/server`
- **Clerk client APIs** from `@clerk/nextjs`

### Styling
- **Tailwind CSS v4** with `tw-animate-css` and `shadcn/tailwind.css`
- **Dark mode** via `next-themes` — use the `dark:` variant or `@custom-variant dark` as configured in `globals.css`
- **Custom theme tokens** are defined as CSS variables in `globals.css` (e.g. `--primary`, `--background`, `--border`)
- **Utility:** `cn()` from `@/lib/utils` merges Tailwind classes safely — always use it for conditional/merged classes

---

## Database (Drizzle + Neon)

### Connection
```ts
// src/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL!);
```
Import `db` from `@/index` in server code (API routes, server components, server actions).

### Schema
Define tables in `src/db/schema.ts` using `drizzle-orm/pg-core`. Example pattern:
```ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  // ...
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Migrations
```bash
npx drizzle-kit generate   # generate migration files
npx drizzle-kit migrate    # apply migrations to Neon
```
Or use `tsx` to run a custom migrate script.

### Rules
- **ALWAYS** use parameterized queries via Drizzle's query builder — never inline raw SQL strings
- **ALWAYS** validate/sanitize user input before persisting
- **Prefer** `uuid` for primary keys over auto-increment integers

---

## Auth (Clerk)

### Middleware
`src/proxy.ts` uses `clerkMiddleware()` with `createRouteMatcher` from `@clerk/nextjs/server`. Route protection (gating `/dashboard`, homepage redirect) is handled here — **not** in page components. Do not rename or move this file without also updating the matcher.

Current pattern:
```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])
const isHomeRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    await auth.protect()          // redirects to sign-in if unauthenticated
  }
  if (isHomeRoute(req)) {
    const { userId } = await auth()
    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
})
```

### Server-side auth (API routes)
For API routes that need auth, use `auth()` as a fine-grained check — route-level gating is already handled by the middleware:
```ts
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  // ...
}
```

### Client-side auth
- `<Show when="signed-in">` / `<Show when="signed-out">` for conditional rendering
- `<SignInButton mode="modal">`, `<SignUpButton mode="modal">` for auth triggers
- `<UserButton>` for the user profile dropdown
- **NEVER** use deprecated `<SignedIn>` / `<SignedOut>` — use `<Show>` instead
- **Auth buttons in the header must live in a `"use client"` component** (`src/components/header-auth.tsx`) — `<Show>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` do not work in server components

### Route protection

**Clerk is the ONLY auth mechanism for this app.** No other auth methods (NextAuth, Auth.js, Supabase Auth, Firebase Auth, custom JWT, etc.) may be introduced.

- **`/dashboard` is a protected route** — gated by `auth.protect()` in `src/proxy.ts`. If unauthenticated, Clerk redirects to sign-in. Do NOT add `auth()` checks to `src/app/dashboard/page.tsx` — the middleware handles it.
- **Homepage redirect** — handled in `src/proxy.ts`: if `userId` exists on `/`, middleware redirects to `/dashboard`. Do NOT add `auth()` or `redirect()` calls to `src/app/page.tsx`.
- **API routes** under `src/app/api/` that require auth must call `const { userId } = await auth()` and return 401 if `userId` is null.
- **NEVER** use `currentUser()` — it is deprecated in Clerk v7 and causes server render hangs. Use `auth()` for session checks and `clerkClient.users.getUser(userId)` if full user data is needed.

### Environment variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```
Copy these from the [Clerk Dashboard](https://dashboard.clerk.com/).

---

## UI (shadcn/ui + Tailwind v4)

### Adding a shadcn component
```bash
npx shadcn add <component-name>
```
Components land in `src/components/ui/` and are ready to import from `@/components/ui/<name>`.

### Existing UI components
| Component | Path |
|-----------|------|
| Button    | `@/components/ui/button` |
| Card      | `@/components/ui/card` |
| Dialog    | `@/components/ui/dialog` |
| Input     | `@/components/ui/input` |
| Sonner    | `@/components/ui/sonner` |

### Button variants
`default` | `outline` | `secondary` | `ghost` | `destructive` | `link`
Button sizes: `xs` | `sm` | `default` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`

---

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run start     # start production server
npm run lint      # run ESLint
```

### Drizzle
```bash
npx drizzle-kit generate   # generate migrations from schema changes
npx drizzle-kit migrate    # apply pending migrations
npx drizzle-kit studio     # open Drizzle Studio (DB browser)
```

---

## Rules for AI Agents

### ALWAYS
- Read the Next.js guide in `node_modules/next/dist/docs/` before using unfamiliar APIs
- Use App Router conventions (`app/` directory, `layout.tsx`, `page.tsx`, `route.ts`)
- Keep server components server-side — only add `"use client"` when absolutely necessary
- Use `cn()` from `@/lib/utils` for merging Tailwind classes
- Use parameterized Drizzle queries — never raw SQL
- Use `<Show when="signed-in">` / `<Show when="signed-out">` for Clerk conditional rendering — inside a `"use client"` component
- Use `mode="modal"` on Clerk's `<SignInButton>` and `<SignUpButton>`
- Use the `@/*` path alias for all internal imports
- Handle route protection in `src/proxy.ts` via `clerkMiddleware` with `createRouteMatcher` and `auth.protect()` — NOT in page components
- Put Clerk UI components (`<Show>`, `<UserButton>`, etc.) in `"use client"` components (e.g. `src/components/header-auth.tsx`)

### NEVER
- Use Pages Router conventions (`_app.tsx`, `pages/`, `getServerSideProps`)
- Use deprecated Clerk APIs (`authMiddleware`, `<SignedIn>`, `<SignedOut>`, `withAuth`, `currentUser`)
- Use raw SQL strings in database queries
- Introduce any auth method other than Clerk (no NextAuth, Auth.js, Supabase Auth, Firebase Auth, custom JWT, etc.)
- Allow unauthenticated access to `/dashboard` or any protected route
- Show the homepage (`/`) to a signed-in user — always redirect to `/dashboard`
- Call `auth()` or `redirect()` in page components for route gating — use the middleware (`proxy.ts`) instead
- Add `"use client"` to a file that can remain a server component
- Rename `src/proxy.ts` — it is intentionally named for Clerk's middleware pattern
- Use `any` in TypeScript unless there's no alternative — prefer `unknown` or proper types

