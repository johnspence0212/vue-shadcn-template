---
name: switch-database-provider
description: Switches EF Core between Sqlite, SqlServer, and PostgreSQL via configuration and provider packages. Use when changing database, Docker Postgres, SQL Server, or connection strings.
---

# Switch Database Provider

Configuration-driven in `ServiceCollectionExtensions.AddDatabaseConfiguration`. See [reference.md](reference.md).

## Steps

1. Set `Database:Provider` in `appsettings.json` or environment:
   - `Sqlite` | `SqlServer` | `PostgreSQL`
2. Set `Database:ConnectionString` appropriately
3. Ensure provider NuGet package exists in `apps/api/Api.csproj`:
   - `Microsoft.EntityFrameworkCore.Sqlite`
   - `Microsoft.EntityFrameworkCore.SqlServer`
   - `Npgsql.EntityFrameworkCore.PostgreSQL`
4. Create a **new migration** after provider change (provider-specific types may differ):
   ```bash
   dotnet ef migrations add SwitchTo{Provider} --project apps/api
   ```
5. Restart API — `DbInitializer` runs `MigrateAsync()`

## Environment variables (Aspire / Docker)

```
Database__Provider=PostgreSQL
Database__ConnectionString=Host=localhost;Database=template;Username=...
```

## E2E

`e2e/playwright.config.ts` forces Sqlite: `Database__ConnectionString=Data Source=app-e2e.db`

## Do not

- Use `EnsureCreated()`
- Commit production connection strings with passwords
