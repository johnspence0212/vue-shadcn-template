# Agent entry point

> **Source of truth for conventions:** `.cursor/rules/` and `.cursor/skills/`  
> Read the `project-overview` rule first if unfamiliar with this repo.

## Start here

| I want to… | Use |
|------------|-----|
| Run the full stack (dev) | Skill: `run-dev-environment` |
| Deploy with Docker (optional) | Skill: `run-docker-deploy` |
| Add a DB entity end-to-end | Skill: `add-fullstack-entity` |
| Change database provider | Skill: `switch-database-provider` |
| Add auth / swap to Entra | Skill: `replace-auth` |
| Run tests like CI | Skill: `run-ci-locally` |
| Add EF migration | Skill: `add-ef-migration` |
| Debug login / 401 | Skill: `debug-auth-flow` |

## Repo map

- `apps/web` — Vue 3 + Effect + shadcn-vue
- `apps/api` — .NET 9 Web API + EF + JWT auth
- `aspire/AppHost` — start API + Vite together (primary dev workflow)
- `apps/api.tests` — integration tests
- `e2e/` — Playwright tests

See `.cursor/docs/FILE-INDEX.md` for key file paths.

## Commands

### Aspire (primary)

```bash
dotnet run --project aspire/AppHost
```

### apps/web

```bash
cd apps/web && npm run dev
cd apps/web && npm run build
cd apps/web && npm run lint
cd apps/web && npm run type-check
cd apps/web && npm run test:unit
```

### apps/api

```bash
cd apps/api && dotnet run
cd apps/api && dotnet build
export PATH="$PATH:$HOME/.dotnet/tools"
dotnet ef migrations add MigrationName --project apps/api
```

### Tests

```bash
dotnet test apps/api.tests/Api.Tests.csproj
cd e2e && npm test
```

### Docker (optional deploy — not for dev)

```bash
cp .env.docker.example .env   # set JWT_SECRET
docker compose up --build
```

## Never do

- Use `frontend/`, `backend/Api/` paths (removed)
- Use Axios or `@effect/schema` (use Effect + `effect/Schema`)
- Use `EnsureCreated` (use EF migrations)
- Commit secrets, `.env`, or `*.db` files
- Use Docker Compose for local dev (use Aspire instead)
- Add GitHub Copilot files (`copilot-instructions.md`, `.copilot/`)
