# Aspire orchestration

The AppHost starts the API and Vite dev server together with service discovery.

## Prerequisites

- .NET 10 SDK + ASP.NET Core 10 runtime (`aspnet-runtime-10.0` on Arch)
- Aspire workload: `dotnet workload install aspire`
- Node.js 22+ and npm

## Run

From the **repository root** (not inside `aspire/AppHost`):

```bash
cd /path/to/vue-shadcn-template
dotnet run --project aspire/AppHost

# If HTTPS dev cert is not trusted:
dotnet run --project aspire/AppHost --launch-profile http
```

If `dotnet --version` shows 9.x but you installed .NET 10, either use the .NET 10 binary directly (e.g. `/usr/share/dotnet/dotnet`) or ensure `global.json` in the repo root is picked up.

The Aspire dashboard shows URLs for `api` and `web`. The web app receives `VITE_API_BASE_URL` pointing at the API `/api` endpoint.

## Projects

| Project | Role |
|---------|------|
| `aspire/AppHost` | Orchestrator (not deployed) |
| `aspire/ServiceDefaults` | OpenTelemetry, health checks, resilience |
| `apps/api` | References ServiceDefaults |

## Adding resources

See skill: `add-aspire-resource` in `.cursor/skills/`.
