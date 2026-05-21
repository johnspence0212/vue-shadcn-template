---
name: run-docker-deploy
description: Builds and runs the optional Docker Compose deployment stack (api + nginx web). Use when deploying, self-hosting, containerizing, or running docker compose — not for local dev (use run-dev-environment / Aspire instead).
---

# Run Docker Deploy

Docker is **optional**. Local dev stays on Aspire or standalone `dotnet run` / `npm run dev`. Use this skill only when the user wants containerized deployment.

## Quick start

```bash
cd /path/to/vue-shadcn-template
cp .env.docker.example .env
# Set JWT_SECRET (required). Edit other vars as needed.

docker compose up --build
```

Open `http://localhost:8080` (or `WEB_PORT` from `.env`).

## Stack

| Service | Image | Notes |
|---------|-------|-------|
| `web` | nginx + Vite `dist` | Only public port; proxies `/api` → `api:8080` |
| `api` | .NET publish | Internal only; SQLite at `/data/app.db` (volume) |

Build context is the **repo root** (not `apps/api` or `apps/web` alone).

## Key files

| File | Role |
|------|------|
| `docker-compose.yml` | Default: SQLite + api + web |
| `docker-compose.postgres.yml` | Optional overlay for PostgreSQL |
| `.env.docker.example` | Template for root `.env` (gitignored) |
| `apps/api/Dockerfile` | Multi-stage API build; copies `Directory.Build.props` |
| `apps/web/Dockerfile` | Node build → nginx |
| `apps/web/nginx.conf` | SPA fallback + `/api` reverse proxy |
| `.dockerignore` | Excludes `node_modules`, `bin/obj`, `.env`, etc. |

## Environment (compose → API)

Set in root `.env`; compose maps to ASP.NET config:

```
JWT_SECRET=...                    # required
WEB_PORT=8080
WEB_ORIGIN=http://localhost:8080  # CORS (same-origin via nginx usually fine)
Auth__AllowRegistration=false     # via AUTH_ALLOW_REGISTRATION
```

Compose sets `DisableHttpsRedirection=true` (TLS terminates at nginx/load balancer, not the API container).

Web build arg: `VITE_API_BASE_URL=/api` (same-origin; baked at image build time).

## PostgreSQL overlay

Existing migrations are **SQLite-oriented**. Default compose uses SQLite so migrations work out of the box.

For PostgreSQL:

1. Add a provider migration (skill `add-ef-migration` / `switch-database-provider`)
2. Set `POSTGRES_PASSWORD` in `.env`
3. Run:

```bash
docker compose -f docker-compose.yml -f docker-compose.postgres.yml up --build
```

## Verify

```bash
curl -fsS http://localhost:8080/                    # SPA HTML
curl -fsS -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@template.local","password":"AdminPassword123!"}'
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `JWT_SECRET` / `POSTGRES_PASSWORD` required | Copy `.env.docker.example` → `.env` and set values |
| API unhealthy / migration error on PostgreSQL | Add PostgreSQL migration first, or use default SQLite compose |
| API build fails (missing `Task`, etc.) | Ensure `Directory.Build.props` is copied in `apps/api/Dockerfile` |
| 502 on `/api` | Wait for api healthcheck; `docker compose logs api` |
| Stale web API URL | Rebuild web image (`VITE_API_BASE_URL` is build-time) |

## Do not

- Use Docker Compose for day-to-day dev (no Vite HMR, no Aspire dashboard)
- Commit root `.env` with real secrets
- Expose the API port publicly without TLS in production
- Ship AppHost to production — it orchestrates dev only

See [reference.md](reference.md) for Dockerfile and nginx details.
