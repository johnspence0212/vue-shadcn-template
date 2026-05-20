# Aspire Reference

## Key files

| File | Purpose |
|------|---------|
| `aspire/AppHost/Program.cs` | Resource + project wiring |
| `aspire/AppHost/AppHost.csproj` | Aspire hosting packages |
| `aspire/ServiceDefaults/Extensions.cs` | Shared telemetry, health, HTTP defaults |
| `apps/api/Program.cs` | `AddServiceDefaults()` |
| `apps/api/Extensions/ServiceCollectionExtensions.cs` | EF / external services |

## Current AppHost wiring

```csharp
var api = builder.AddProject<Projects.Api>("api")
    .WithHttpHealthCheck("/health");

var web = builder.AddNpmApp("web", "../../apps/web", "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_BASE_URL", api.GetEndpoint("http") + "/api");
```

## Common packages (AppHost.csproj)

```xml
<PackageReference Include="Aspire.Hosting.PostgreSQL" />
<PackageReference Include="Aspire.Hosting.Redis" />
<PackageReference Include="Aspire.Hosting.RabbitMQ" />
```

## API consumption patterns

- **EF Postgres:** set `Database__Provider=PostgreSQL` + Aspire-injected connection string
- **Redis:** `builder.AddRedisClient("cache")` in API when using Aspire client integrations

## Docs

- [.NET Aspire hosting](https://learn.microsoft.com/dotnet/aspire/fundamentals/app-host-overview)
