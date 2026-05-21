# XONET Frontend

Premium dark freelancer portal built with **Next.js App Router**, Tailwind CSS v4, shadcn/ui, and Lucide React.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Project structure

```
app/                    # Next.js App Router (pages + layouts)
  (dashboard)/          # Main app shell with sidebar
  globals.css           # Theme & Tailwind
  layout.tsx            # Root layout + providers

components/
  layout/               # AppLayout, AppSidebar, TopNav
  views/                # Page-level client components
  tasks/                # Task UI (cards, forms, applications)
  ui/                   # shadcn/ui primitives
  providers.tsx         # Global client providers

lib/
  navigation.ts         # Sidebar nav config
  task-store.tsx        # Client state (localStorage)
  dummy-data.ts         # Seed data & chart fixtures
  types.ts
  utils.ts

hooks/
public/                 # Static assets
```

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/explore` | Explore Tasks |
| `/tasks` | Tasks & applications |
| `/tasks/create` | Create Task |
| `/my-works` | My Works |
| `/freelancers` | Freelancers |
| `/account` | Profile |

Legacy URLs redirect in `next.config.ts`:

- `/create-task` → `/tasks/create`
- `/applications` → `/tasks?tab=applications`

## Stack

- Next.js 15 · React 19 · TypeScript
- Tailwind CSS 4 · shadcn/ui · Recharts
- Client task store with `localStorage` (demo; no backend required)
