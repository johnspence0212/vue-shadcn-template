---
name: replace-auth
description: Replaces JWT cookie/session auth with another provider (Entra ID, Auth0, Keycloak, Identity Server). Use when migrating authentication, SSO, or OIDC integration across api and web.
---

# Replace Auth Provider

Major cross-cutting change. See [reference.md](reference.md) for all touch points.

## Planning

1. Choose provider (OIDC recommended)
2. Decide token model: JWT from your API vs provider access tokens
3. Map user identity to `User` entity or external subject only

## Backend changes (`apps/api`)

| Area | Action |
|------|--------|
| `ServiceCollectionExtensions` | Replace `AddJwtBearer` with provider handler |
| `AuthController` | Adapt login/register or remove if purely external |
| `JwtTokenService` | Remove or wrap provider token issuance |
| `BaseController` | Keep `[Authorize]` — update scheme/policy |
| `appsettings` | New authority, client id/secret sections |

## Frontend changes (`apps/web`)

| Area | Action |
|------|--------|
| `stores/auth.ts` | Provider login flow, token storage |
| `authApi.ts` | New endpoints or MSAL/OIDC client |
| `lib/authToken.ts` | Token source for `httpClient` |
| `router/index.ts` | Guard logic (may use silent renew) |
| `LoginView.vue` | Redirect or embedded provider UI |

## Testing

- Update `apps/api.tests/CustomWebApplicationFactory` auth
- Update `e2e/tests/auth.spec.ts`
- Run full CI locally (`run-ci-locally` skill)

## Constraints

- Keep CRUD behind authorization — never ship open `BaseController` endpoints
- Update CORS / redirect URIs for new origins
- Do not commit client secrets
