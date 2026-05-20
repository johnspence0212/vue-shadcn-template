# Vue + .NET Full Stack Template

Enterprise monorepo template: Vue 3 SPA, .NET 9 API, Aspire orchestration, JWT auth, and Effect-based API client.

## Quick start (Aspire)

**Prerequisites:** .NET 10 SDK, Node.js 22+, npm, Aspire workload (`dotnet workload install aspire`)

```bash
git clone https://github.com/johnspence0212/vue-shadcn-template.git my-app
cd my-app   # repository root — required

# Use .NET 10 (global.json pins 10.0.104). If `dotnet --version` shows 9.x, use your .NET 10 install:
dotnet run --project aspire/AppHost

# HTTP-only profile (no dev HTTPS cert):
dotnet run --project aspire/AppHost --launch-profile http
```

Open the Aspire dashboard for API and web URLs. Default seeded admin:

- Email: `admin@template.local`
- Password: `AdminPassword123!`

## Repository layout

```
vue-shadcn-template/
├── apps/
│   ├── web/          # Vue 3 + Vite + shadcn-vue
│   └── api/          # .NET 9 Web API + EF Core
├── apps/api.tests/   # Integration tests
├── aspire/
│   ├── AppHost/      # Orchestrator
│   └── ServiceDefaults/
├── e2e/              # Playwright
├── Template.sln
└── .cursor/          # Agent rules & skills
```

## Stack

| Layer | Technology |
|-------|------------|
| Web | Vue 3, TypeScript, Vite, Pinia, Tailwind 4, shadcn-vue |
| API client | Effect + native `fetch` + `effect/Schema` |
| API | .NET 9, EF Core 9, JWT, Scalar (OpenAPI) |
| DB | SQLite (default), SqlServer, PostgreSQL |
| Orchestration | .NET Aspire AppHost |

## Individual apps (debugging)

```bash
# API only (http://localhost:5000)
cd apps/api && dotnet run

# Web only (http://localhost:5173)
cd apps/web && cp .env.example .env && npm install && npm run dev
```

Set `VITE_API_BASE_URL=http://localhost:5000/api` in `apps/web/.env`.

## Tests

```bash
dotnet test apps/api.tests/Api.Tests.csproj
cd apps/web && npm run test:unit
cd e2e && npm install && npm test
```

## Documentation

- [apps/web/README.md](apps/web/README.md)
- [apps/api/README.md](apps/api/README.md)
- [aspire/README.md](aspire/README.md)
- [MIGRATION.md](MIGRATION.md) — upgrading from old `frontend/` / `backend/Api/` layout
- [AGENTS.md](AGENTS.md) — AI agent entry point
- `.cursor/rules/` and `.cursor/skills/` — detailed conventions

## License

MIT
