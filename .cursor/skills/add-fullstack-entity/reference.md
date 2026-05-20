# Task Entity Reference Paths

Use these files as the canonical pattern when adding a new entity.

## Backend

| Step | File |
|------|------|
| Model | `apps/api/Models/TaskItem.cs` |
| Configuration | `apps/api/Data/Configurations/TaskItemConfiguration.cs` |
| DbContext | `apps/api/Data/AppDbContext.cs` (`DbSet<TaskItem> Tasks`) |
| Controller | `apps/api/Controllers/TaskController.cs` |
| Base CRUD | `apps/api/Controllers/BaseController.cs` |
| Base config | `apps/api/Data/Configurations/BaseEntityConfiguration.cs` |
| Migration | `apps/api/Migrations/20260520005217_InitialCreate.cs` |

## Frontend

| Step | File |
|------|------|
| Schema | `apps/web/src/api/types/schema.ts` (`TaskSchema`) |
| API client | `apps/web/src/api/taskApi.ts` |
| Base service | `apps/web/src/api/base/base.ts` |
| HTTP client | `apps/web/src/api/base/client.ts` |
| View | `apps/web/src/views/TasksView.vue` |
| Route | `apps/web/src/router/index.ts` (`/tasks`) |

## Auth (required for CRUD)

- `apps/api/Controllers/BaseController.cs` — `[Authorize]`
- `apps/web/src/stores/auth.ts`
- `apps/web/src/router/index.ts` — `requiresAuth` meta
