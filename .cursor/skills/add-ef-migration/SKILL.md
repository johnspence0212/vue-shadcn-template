---
name: add-ef-migration
description: Creates and applies EF Core migrations for apps/api schema changes. Use when altering entities, adding tables, or updating the database schema after model changes.
disable-model-invocation: true
---

# Add EF Migration

## Prerequisites

- EF tools: `dotnet tool install --global dotnet-ef` (or use local tool)
- Model + configuration changes committed in `apps/api`

## Create migration

```bash
cd /home/johnspence/Repos/vue-shadcn-template
dotnet ef migrations add <MigrationName> \
  --project apps/api \
  --startup-project apps/api
```

Review generated files in `apps/api/Migrations/`.

## Apply locally

**Automatic (default):** API startup calls `DbInitializer` → `MigrateAsync()`.

**Manual:**
```bash
dotnet ef database update --project apps/api
```

## Design-time factory

`apps/api/Data/DesignTimeDbContextFactory.cs` supplies context for CLI when AppHost isn't running.

## Provider note

If switching Sqlite ↔ PostgreSQL ↔ SqlServer, see skill `switch-database-provider` — may require new baseline migration.

## Checklist

```
- [ ] Model + Configuration updated
- [ ] DbSet added to AppDbContext (if new entity)
- [ ] migration add <Name>
- [ ] Review Up/Down for destructive changes
- [ ] dotnet build apps/api
- [ ] Run API and verify schema
```

## Never

- `Database.EnsureCreated()`
- Delete production DB without backup
- Edit applied migration history in shared environments — add new migration instead
