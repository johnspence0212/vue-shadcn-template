# Auth Touch Points

## Backend

| File | Role |
|------|------|
| `apps/api/Extensions/ServiceCollectionExtensions.cs` | `AddAuthentication`, `AddJwtBearer` |
| `apps/api/Extensions/WebApplicationExtensions.cs` | `UseAuthentication`, `UseAuthorization` |
| `apps/api/Controllers/AuthController.cs` | Login, register, me |
| `apps/api/Services/JwtTokenService.cs` | Token creation |
| `apps/api/Services/IJwtTokenService.cs` | Token interface |
| `apps/api/Options/JwtOptions.cs` | JWT settings |
| `apps/api/Options/AuthOptions.cs` | Registration flag |
| `apps/api/Contracts/Auth/*.cs` | DTOs |
| `apps/api/Models/User.cs` | User entity |
| `apps/api/Controllers/BaseController.cs` | `[Authorize]` on CRUD |

## Frontend

| File | Role |
|------|------|
| `apps/web/src/stores/auth.ts` | Session state |
| `apps/web/src/api/authApi.ts` | Auth HTTP calls |
| `apps/web/src/lib/authToken.ts` | Bearer header source |
| `apps/web/src/api/base/client.ts` | Injects Authorization |
| `apps/web/src/router/index.ts` | Route guards |
| `apps/web/src/views/LoginView.vue` | Login UI |
| `apps/web/src/views/RegisterView.vue` | Register UI |
| `apps/web/src/main.ts` | `auth.hydrate()` |

## Tests & config

| File | Role |
|------|------|
| `apps/api.tests/AuthIntegrationTests.cs` | API auth tests |
| `apps/api.tests/CustomWebApplicationFactory.cs` | Test host |
| `e2e/tests/auth.spec.ts` | E2E auth |
| `apps/api/appsettings.json` | Jwt, Auth, WebOrigins |
| `aspire/AppHost/Program.cs` | Web env injection |

## Current JWT flow

1. `POST /api/auth/login` → `{ accessToken, expiresAt }`
2. Frontend stores token → `authToken` → `Authorization: Bearer`
3. `GET /api/auth/me` loads user
4. CRUD requires valid JWT (`sub` claim)
