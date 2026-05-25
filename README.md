# XONET — Monorepo

Premium dark freelancer marketplace with a **Next.js frontend** and **Express + MongoDB backend**.

## Project structure

```
xonet/
├── frontend/          # Next.js App Router UI
│   ├── app/           # Pages & NextAuth route
│   ├── components/    # UI components
│   ├── lib/           # Client utilities & workspace provider
│   └── hooks/
├── backend/           # Express REST API
│   ├── src/
│   │   ├── models/    # Mongoose schemas
│   │   ├── services/  # Business logic
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── db/
│   └── scripts/       # Database seed
└── package.json       # Workspace root (runs both apps)
```

## Quick start

1. **Install dependencies** (from repo root):

```bash
npm install
```

2. **Configure environment**:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Set `MONGODB_URI`, `JWT_SECRET` / `NEXTAUTH_SECRET`, and URLs.

3. **Run both servers**:

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:4000  

4. **Optional seed data**:

```bash
npm run seed
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run dev:frontend` | Next.js only (port 3000) |
| `npm run dev:backend` | Express API only (port 4000) |
| `npm run build` | Build frontend for production |
| `npm run seed` | Seed MongoDB with demo users |

## API (backend)

All routes are prefixed with `/api`:

- `POST /api/auth/register` · `POST /api/auth/login`
- `GET /api/workspace`
- `POST /api/tasks` · `PATCH/DELETE /api/tasks/:id`
- `POST /api/applications` · `PATCH /api/applications/:id`
- `PATCH /api/works/:id`
- `GET/POST /api/messages`
- `PATCH /api/profile`
- `GET /api/freelancers`

The frontend authenticates via **NextAuth** (JWT session) and sends the backend **Bearer token** on every API call.
