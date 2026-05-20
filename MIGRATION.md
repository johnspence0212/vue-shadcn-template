# Migration from legacy layout

If you cloned an older version of this template, paths changed as follows:

| Old | New |
|-----|-----|
| `frontend/` | `apps/web/` |
| `backend/Api/` | `apps/api/` |
| `budget.db` | `app.db` (configurable) |
| `FrontendUrl` | `WebOrigin` / `WebOrigins` |
| Axios + `@effect/schema` | Effect + `effect/Schema` |
| Swashbuckle | Scalar at `/scalar` (dev) |
| Two-terminal dev | `dotnet run --project aspire/AppHost` |

## Steps

1. Pull latest `main`.
2. Move local env: copy `frontend/.env` → `apps/web/.env` and set `VITE_API_BASE_URL`.
3. Delete old `frontend/` and `backend/` folders if still present.
4. Restore: `dotnet restore Template.sln`, `cd apps/web && npm install`.
5. Run `dotnet run --project aspire/AppHost`.

## Database

The API uses EF migrations. Delete `apps/api/app.db` only if you need a clean dev database; restart the API to re-migrate and re-seed.
