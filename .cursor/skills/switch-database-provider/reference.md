# Database Provider Reference

## Configuration (`apps/api/appsettings.json`)

```json
"Database": {
  "Provider": "Sqlite",
  "ConnectionString": "Data Source=app.db"
}
```

## Switch logic (`apps/api/Extensions/ServiceCollectionExtensions.cs`)

```csharp
switch (provider.ToLowerInvariant())
{
    case "sqlite":
        options.UseSqlite(connectionString);
        break;
    case "sqlserver":
        options.UseSqlServer(connectionString);
        break;
    case "postgresql":
        options.UseNpgsql(connectionString);
        break;
}
```

## Connection string examples

| Provider | Example |
|----------|---------|
| Sqlite | `Data Source=app.db` |
| SqlServer | `Server=localhost;Database=Template;Trusted_Connection=True;TrustServerCertificate=True` |
| PostgreSQL | `Host=localhost;Port=5432;Database=template;Username=postgres;Password=postgres` |

## Related files

- `apps/api/Data/DesignTimeDbContextFactory.cs` — design-time migrations
- `apps/api/Data/DbInitializer.cs` — `MigrateAsync()` on startup
- `apps/api/Migrations/` — migration history

## CLI

```bash
# From repo root
dotnet ef migrations add MigrationName --project apps/api
dotnet ef database update --project apps/api
```
