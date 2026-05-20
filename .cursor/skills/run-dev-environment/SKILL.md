---
name: run-dev-environment
description: Starts the Vue + .NET full stack via Aspire AppHost or standalone api/web processes. Use when the user wants to run, start, or debug the dev environment, local servers, dashboard, or hot reload.
disable-model-invocation: false
---

# Run Dev Environment

## Preferred: Aspire AppHost

```bash
cd /home/johnspence/Repos/vue-shadcn-template
dotnet run --project aspire/AppHost
```

- Opens Aspire dashboard with **api** and **web** endpoints
- Injects `VITE_API_BASE_URL` for the web app automatically
- API health: `/health`

## Standalone (without Aspire)

**Terminal 1 — API:**
```bash
dotnet run --project apps/api
# http://localhost:5000 — Scalar at /scalar/v1 (dev)
```

**Terminal 2 — Web:**
```bash
cd apps/web
cp .env.example .env   # if missing
npm install
npm run dev
# http://localhost:5173
```

Ensure `.env` has `VITE_API_BASE_URL=http://localhost:5000/api`.

## First-time setup

```bash
dotnet restore Template.sln
cd apps/web && npm ci
```

Database migrates on API startup (`DbInitializer`). Default admin: `admin@template.local` / `AdminPassword123!` (see `appsettings.json` Seed section).

## Verify

1. Open web → login with seed admin
2. Hit `/tasks` after auth
3. API: `GET /health` and `GET /api/auth/me` with Bearer token

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Match `WebOrigin` in `appsettings.Development.json` to Vite port |
| 401 on CRUD | Login first; check `Authorization: Bearer` in network tab |
| Port in use | Change `--urls` on api or Vite `--port` |
| Stale DB | Delete `apps/api/app.db` and restart (migrations reapply) |
