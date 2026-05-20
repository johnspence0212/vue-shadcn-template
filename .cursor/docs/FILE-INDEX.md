# File Index

Quick map of key files in the vue-shadcn-template monorepo.

## Solution & orchestration

| File | Role |
|------|------|
| `Template.sln` | Solution entry (Api, Api.Tests, ServiceDefaults, AppHost) |
| `aspire/AppHost/Program.cs` | Aspire distributed app — api project + npm web |
| `aspire/ServiceDefaults/Extensions.cs` | OpenTelemetry, health, service discovery |
| `Directory.Build.props` | Shared MSBuild properties |

## API (`apps/api`)

| File | Role |
|------|------|
| `Program.cs` | Host bootstrap, migrate/seed, pipeline |
| `Extensions/ServiceCollectionExtensions.cs` | DI: JWT, EF, CORS, OpenAPI |
| `Extensions/WebApplicationExtensions.cs` | Pipeline: Scalar, auth, health, controllers |
| `Controllers/BaseController.cs` | Authorized generic CRUD |
| `Controllers/AuthController.cs` | Login, register, me |
| `Controllers/TaskController.cs` | Task CRUD (example entity) |
| `Data/AppDbContext.cs` | EF Core context |
| `Data/DbInitializer.cs` | Migrate + seed admin user |
| `Data/Configurations/TaskItemConfiguration.cs` | Task entity mapping |
| `Data/Configurations/UserConfiguration.cs` | User entity mapping |
| `Models/TaskItem.cs` | Task entity |
| `Models/User.cs` | User entity |
| `Services/JwtTokenService.cs` | JWT creation |
| `Options/JwtOptions.cs` | JWT config binding |
| `Options/AuthOptions.cs` | Registration toggle |
| `appsettings.json` | Database, JWT, CORS, seed defaults |
| `Migrations/` | EF Core migrations |

## API tests

| File | Role |
|------|------|
| `apps/api.tests/AuthIntegrationTests.cs` | Auth + health integration tests |
| `apps/api.tests/CustomWebApplicationFactory.cs` | Test host factory |

## Web (`apps/web`)

| File | Role |
|------|------|
| `src/main.ts` | Vue app entry, Pinia, router, auth hydrate |
| `src/router/index.ts` | Routes + auth guards |
| `src/stores/auth.ts` | JWT session, login/register/logout |
| `src/api/base/client.ts` | fetch + Effect httpClient + Bearer |
| `src/api/base/base.ts` | BaseApiService CRUD |
| `src/api/authApi.ts` | Auth endpoints |
| `src/api/taskApi.ts` | Task API (example) |
| `src/api/types/schema.ts` | Effect Schema definitions |
| `src/lib/authToken.ts` | Token getter for httpClient |
| `src/views/LoginView.vue` | Login page |
| `src/views/RegisterView.vue` | Register page |
| `src/views/TasksView.vue` | Task list (example feature) |
| `components.json` | shadcn-vue CLI config |
| `.env.example` | `VITE_API_BASE_URL` template |

## E2E & CI

| File | Role |
|------|------|
| `e2e/playwright.config.ts` | Starts api + web, runs tests |
| `e2e/tests/auth.spec.ts` | Auth flow e2e |
| `.github/workflows/ci.yml` | api / web / e2e CI jobs |

## Cursor config

| Path | Role |
|------|------|
| `.cursor/rules/` | Agent rules (always + glob-scoped) |
| `.cursor/skills/` | Task-specific agent skills |
| `.cursor/docs/FILE-INDEX.md` | This file |
