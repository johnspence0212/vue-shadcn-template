# apps/web — Vue SPA

Vue 3 + TypeScript + Vite + shadcn-vue + Effect API client.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

`VITE_API_BASE_URL` must include the `/api` suffix (e.g. `http://localhost:5000/api`). Aspire sets this automatically when using AppHost.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run type-check` | `vue-tsc` |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest |

## API layer

- `src/api/base/client.ts` — Effect `fetch` wrapper + Bearer token
- `src/api/base/base.ts` — `BaseApiService` CRUD
- `src/api/types/schema.ts` — `effect/Schema` definitions
- `src/stores/auth.ts` — JWT in `sessionStorage`

## Auth routes

- `/login`, `/register` — guest layout (no sidebar)
- All other routes require authentication (router guard)

## shadcn-vue

```bash
npx shadcn-vue@latest add button
```

Config: `components.json` at project root of `apps/web`.
