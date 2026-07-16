# CarTrust — Premium Vehicle Marketplace

A full-stack vehicle marketplace with role-based dashboards, Supabase auth, Prisma + PostgreSQL, and paid listing boosts.

## Tech

**Next.js 16 · TypeScript 5 · pnpm · Turborepo · Prisma 5 · Supabase · Tailwind CSS 3 · Zod · Zustand · Leaflet**

## Structure

```
apps/
  web/         Next.js 16 app (App Router, server actions, API routes)
packages/
  auth/        Supabase SSR & browser client
  db/          Prisma client + schema (User, Vehicle, VehicleMedia, etc.)
  shared/      Shared TS types & enums
  ui/          Reusable components (Button, Input, Card, Skeleton)
  vehicle-core Vehicle domain logic (service, validation, repository)
  media/       Supabase Storage wrapper (upload/delete)
  payments/    Boost listing payments (bKash integration)
  rbac/        Role hierarchy & access control
```

## Getting Started

```bash
pnpm install
# Copy .env.example → .env.local and fill in Supabase credentials
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all workspaces in dev mode |
| `pnpm build` | Build all packages + app |
| `pnpm lint` | Lint all workspaces |
| `pnpm format` | Format with Prettier |
