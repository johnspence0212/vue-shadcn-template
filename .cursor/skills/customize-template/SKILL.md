---
name: customize-template
description: Rebrands and reconfigures the template — app name, seed users, CORS origins, JWT issuer, OpenAPI title, and sidebar navigation. Use when forking, white-labeling, or project-specific setup.
---

# Customize Template

See [reference.md](reference.md) for all touch points.

## Quick wins

| What | Where |
|------|-------|
| API title | `apps/api/appsettings.json` → `OpenApi:Title` |
| JWT issuer/audience | `Jwt:Issuer`, `Jwt:Audience` |
| Seed admin | `Seed:AdminEmail`, `Seed:AdminPassword` |
| Allow registration | `Auth:AllowRegistration` |
| CORS | `WebOrigin`, `WebOrigins` |
| Web package name | `apps/web/package.json` → `name` |
| Page title | `apps/web/index.html` |

## Secrets (development)

```bash
cd apps/api
dotnet user-secrets set "Jwt:Secret" "your-dev-secret-at-least-32-chars"
```

Never commit real secrets. Keep placeholder in `appsettings.json`.

## Navigation / branding

- Sidebar: `apps/web/src/components/AppSidebar.vue`
- Home content: `apps/web/src/views/HomeView.vue`
- Styles: `apps/web/src/style.css`, Tailwind theme

## Auth branding

- Login/Register: `apps/web/src/views/LoginView.vue`, `RegisterView.vue`
- Token storage key: `stores/auth.ts` → `TOKEN_KEY` (change if multi-app on same origin)

## After changes

1. `dotnet build Template.sln`
2. `cd apps/web && npm run build`
3. Update `README.md` (if present) with new defaults

Do not create Copilot instruction files — use `.cursor/rules/` instead.
