---
name: debug-auth-flow
description: Diagnoses JWT login, token storage, CORS, and 401 errors across Vue and .NET API. Use when auth fails, tokens missing, me endpoint 401, or protected routes redirect loops.
disable-model-invocation: true
---

# Debug Auth Flow

## Symptom checklist

| Symptom | Likely cause |
|---------|----------------|
| Login 401 | Wrong credentials; user not seeded |
| CRUD 401 | Missing/expired Bearer token |
| CORS error | `WebOrigin` mismatch with Vite URL |
| Redirect loop | `hydrate()` fails → logout → login → home |
| Register 403 | `Auth:AllowRegistration` false |

## Step 1: API login

```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@template.local","password":"AdminPassword123!"}'
```

Expect `{ "accessToken": "...", "expiresAt": "..." }`.

## Step 2: API /me

```bash
curl -s http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Step 3: Frontend

1. DevTools → Application → Session Storage → `template_auth_token`
2. Network → API calls include `Authorization: Bearer`
3. Confirm `VITE_API_BASE_URL` ends with `/api` (Aspire injects this)

## Key files

- `apps/web/src/stores/auth.ts` — token + hydrate
- `apps/web/src/lib/authToken.ts` — header sync
- `apps/web/src/api/base/client.ts` — Bearer injection
- `apps/api/Extensions/ServiceCollectionExtensions.cs` — JWT validation
- `apps/api/Controllers/AuthController.cs` — login/me

## JWT config

`Jwt:Secret`, `Issuer`, `Audience` must match between token creation (`JwtTokenService`) and validation (`AddJwtBearer`).

Dev secret in `appsettings.json` is placeholder — use consistent value via user-secrets if changed.

## Integration tests

```bash
dotnet test apps/api.tests/Api.Tests.csproj --filter "FullyQualifiedName~Auth"
```

## E2E

```bash
cd e2e && npm test -- tests/auth.spec.ts
```
