---
name: add-fullstack-entity
description: Adds a new entity end-to-end — EF model, migration, authorized API controller, Effect schema, API client, and Vue view. Use when creating CRUD features, new domain models, or extending the template beyond Task.
---

# Add Full-Stack Entity

Follow the **Task** reference implementation. See [reference.md](reference.md) for exact paths.

## Checklist

```
- [ ] 1. Backend model + EF configuration
- [ ] 2. DbSet on AppDbContext
- [ ] 3. EF migration
- [ ] 4. Controller extending BaseController<T>
- [ ] 5. Effect Schema + BaseApiService client
- [ ] 6. Vue view + route (requiresAuth)
- [ ] 7. Integration test (optional)
```

## Backend (apps/api)

1. **Model** — `Models/{Entity}.cs` inheriting `BaseEntity`
2. **Configuration** — `Data/Configurations/{Entity}Configuration.cs` : `BaseEntityConfiguration<T>`
3. **DbContext** — add `DbSet<{Entity}>`
4. **Migration:**
   ```bash
   dotnet ef migrations add Add{Entity} --project apps/api
   ```
5. **Controller** — `Controllers/{Entity}Controller.cs`:
   ```csharp
   public class FooController(AppDbContext context) : BaseController<Foo>(context) { }
   ```
   `[Authorize]` is inherited from `BaseController`.

## Frontend (apps/web)

1. **Schema** — add `{Entity}Schema` in `src/api/types/schema.ts`
2. **API client** — `src/api/{entity}Api.ts` extending `BaseApiService`
3. **View** — `src/views/{Entity}sView.vue` with `runRequest(api.getAll())`
4. **Router** — route with `meta: { requiresAuth: true }`
5. **Nav** — link in `AppSidebar.vue` if needed

## Verify

- `dotnet build apps/api`
- `cd apps/web && npm run type-check`
- Login → exercise CRUD in UI
- `dotnet test apps/api.tests` if tests added

Do not use Axios, `@effect/schema`, or unauthenticated controllers.
