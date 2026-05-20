# Customization Reference

## Configuration files

| File | Keys |
|------|------|
| `apps/api/appsettings.json` | `Database`, `Jwt`, `Auth`, `Seed`, `WebOrigin`, `WebOrigins`, `OpenApi` |
| `apps/api/appsettings.Development.json` | Dev overrides |
| `apps/web/.env.example` | `VITE_API_BASE_URL` |
| `apps/web/components.json` | shadcn style, aliases |

## Frontend entry

| File | Customize |
|------|-----------|
| `apps/web/src/main.ts` | Plugins, auth hydrate |
| `apps/web/src/App.vue` | Layout shell |
| `apps/web/src/router/index.ts` | Routes, guards |
| `apps/web/src/components/AppSidebar.vue` | Nav items |

## Backend identity

| File | Customize |
|------|-----------|
| `apps/api/Services/JwtTokenService.cs` | Claims, expiry |
| `apps/api/Options/JwtOptions.cs` | Option binding |
| `apps/api/Data/DbInitializer.cs` | Seed logic |

## Aspire

| File | Customize |
|------|-----------|
| `aspire/AppHost/Program.cs` | Service names, ports, env injection |

## Solution

| File | Customize |
|------|-----------|
| `Template.sln` | Rename solution (optional) |
| `Directory.Build.props` | Shared version, analyzers |
