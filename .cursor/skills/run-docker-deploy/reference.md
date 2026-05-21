# Docker Deploy Reference

## Dev vs deploy

| Concern | Local dev | Docker deploy |
|---------|-----------|---------------|
| Entry | `aspire/AppHost` or standalone api/web | `docker compose up` |
| Web | Vite dev server (HMR) | nginx serving static `dist` |
| API URL | `VITE_API_BASE_URL` env / Aspire injection | Built as `/api`; nginx proxies to backend |
| Database | Sqlite file in `apps/api/` | Sqlite volume `/data/app.db` (default) |
| OpenAPI / Scalar | Dev only at `/scalar/v1` | Not mapped in Production |
| Health | `/health` (dev), `/health/ready` | API container checks `/health/ready` |

## API Dockerfile notes

- Build context: repository root
- Must copy `Directory.Build.props` (implicit usings, nullable)
- Must copy `aspire/ServiceDefaults/` (project reference)
- Runtime: `mcr.microsoft.com/dotnet/aspnet:10.0`, port `8080`
- `DisableHttpsRedirection` expected when behind nginx

## Web Dockerfile notes

- `ARG VITE_API_BASE_URL=/api` before `npm run build`
- nginx config proxies `/api/` → `http://api:8080/api/`
- SPA: `try_files $uri $uri/ /index.html`

## Compose profiles

**Default (`docker-compose.yml`):**

```yaml
services:
  api:    # SQLite volume api_data:/data
  web:    # ports WEB_PORT:80
```

**PostgreSQL overlay (`docker-compose.postgres.yml`):**

- Adds `postgres` service
- Overrides api `Database__*` env vars
- Resets api SQLite volume (`volumes: !reset []`)

## Secrets checklist

```
- [ ] JWT_SECRET — long random string (never dev placeholder)
- [ ] POSTGRES_PASSWORD — if using postgres overlay
- [ ] SEED_ADMIN_PASSWORD — change for production
- [ ] AUTH_ALLOW_REGISTRATION=false for production
```

## Related skills

- `run-dev-environment` — Aspire / local dev (not Docker)
- `switch-database-provider` — PostgreSQL migration before postgres compose
- `add-ef-migration` — schema changes affecting container startup migrations
