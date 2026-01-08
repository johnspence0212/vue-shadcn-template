# Agent Guidelines for Vue.js + .NET Full-Stack Development

This document provides comprehensive guidelines for coding agents working on this Vue.js + .NET full-stack application. It covers build commands, testing, code style guidelines, and project conventions.

## 📋 Build/Lint/Test Commands

### Frontend (Vue.js + TypeScript)

**Development Server:**
```bash
cd frontend && npm run dev
```
Starts Vite dev server at `http://localhost:5173`

**Build for Production:**
```bash
cd frontend && npm run build
```
Creates optimized production build in `frontend/dist/`

**Preview Production Build:**
```bash
cd frontend && npm run preview
```
Serves the built application locally for testing

**Type Checking:**
```bash
cd frontend && npm run type-check
```
Runs TypeScript compiler to check for type errors

**Linting:**
```bash
cd frontend && npm run lint
```
Runs ESLint and fixes auto-fixable issues

**Code Formatting:**
```bash
cd frontend && npm run format
```
Formats code using Prettier

**Unit Testing:**
```bash
cd frontend && npm run test:unit
```
Runs all unit tests with Vitest

**Run Specific Test File:**
```bash
cd frontend && npx vitest run src/components/__tests__/ComponentName.spec.ts
```

**Run Tests in Watch Mode:**
```bash
cd frontend && npx vitest
```

### Backend (.NET 9 Web API)

**Restore Dependencies:**
```bash
cd backend/Api && dotnet restore
```

**Run Development Server:**
```bash
cd backend/Api && dotnet run
```
Starts API server at `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`

**Build:**
```bash
cd backend/Api && dotnet build
```

**Run Tests:**
```bash
cd backend/Api && dotnet test
```

### Full Stack

**Start Both Servers:**
```bash
# Terminal 1 - Backend
cd backend/Api && dotnet run

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

**Imports:**
- Use absolute imports with `@/` alias for project files
- Group imports: external libraries first, then internal imports
- Sort imports alphabetically within groups

```typescript
// Good
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/types/task'

// Bad - mixed grouping
import { taskApi } from '@/api/taskApi'
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
```

**Naming Conventions:**
- **Components:** PascalCase (e.g., `TaskCard.vue`, `UserProfile.vue`)
- **Views:** PascalCase + `View` suffix (e.g., `TasksView.vue`, `DashboardView.vue`)
- **API Clients:** camelCase + `Api` suffix (e.g., `taskApi.ts`, `userApi.ts`)
- **Stores:** camelCase + `Store` suffix (e.g., `taskStore.ts`, `authStore.ts`)
- **Types:** PascalCase (e.g., `Task`, `UserProfile`)
- **Interfaces:** PascalCase with `I` prefix optional but consistent
- **Constants:** UPPER_SNAKE_CASE
- **Variables/Functions:** camelCase

**Vue Composition API:**
- Use `<script setup>` syntax for all new components
- Prefer composition functions over mixins
- Use reactive refs and computed properties appropriately

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/types/task'

// Props with proper typing
interface Props {
  initialTasks?: Task[]
}

const props = withDefaults(defineProps<Props>(), {
  initialTasks: () => []
})

// Emits with proper typing
const emit = defineEmits<{
  taskUpdated: [task: Task]
  taskDeleted: [id: number]
}>()

// Reactive state
const tasks = ref<Task[]>([])
const loading = ref(false)

// Computed properties
const completedTasks = computed(() =>
  tasks.value.filter(task => task.isCompleted)
)

// Lifecycle hooks
onMounted(() => {
  loadTasks()
})

// Async functions
const loadTasks = async () => {
  loading.value = true
  try {
    tasks.value = await taskApi.getAll()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

### C# (.NET)

**Naming Conventions:**
- **Classes:** PascalCase (e.g., `TaskController`, `UserService`)
- **Methods:** PascalCase (e.g., `GetAllTasks()`, `CreateUser()`)
- **Properties:** PascalCase (e.g., `Title`, `CreatedAt`)
- **Private Fields:** camelCase with underscore prefix (e.g., `_dbContext`)
- **Constants:** PascalCase (e.g., `MaxLength`)

**Controller Structure:**
```csharp
[Route("api/[controller]")]
public class TaskController : BaseController<Task>
{
    public TaskController(AppDbContext context) : base(context) { }

    // Custom endpoints only - CRUD inherited from BaseController
    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<Task>>> GetCompletedTasks()
    {
        var completedTasks = await _dbSet
            .Where(t => t.IsCompleted)
            .ToListAsync();
        return Ok(completedTasks);
    }
}
```

**Entity Configuration:**
```csharp
public class TaskConfiguration : BaseEntityConfiguration<Task>
{
    public override void Configure(EntityTypeBuilder<Task> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.ToTable("Tasks");
    }
}
```

### Error Handling

**Frontend (Vue.js):**
- Always wrap API calls in try/catch blocks
- Use proper error states in UI
- Log errors for debugging
- Show user-friendly error messages

```typescript
const createTask = async (taskData: Partial<Task>) => {
  loading.value = true
  error.value = null

  try {
    const newTask = await taskApi.create(taskData)
    tasks.value.push(newTask)
    emit('taskCreated', newTask)
  } catch (error) {
    console.error('Failed to create task:', error)
    error.value = 'Failed to create task. Please try again.'
  } finally {
    loading.value = false
  }
}
```

**Backend (C#):**
- Use appropriate HTTP status codes
- Return consistent error responses
- Log exceptions for debugging

```csharp
public override async Task<ActionResult<Task>> Post(Task task)
{
    try
    {
        if (string.IsNullOrWhiteSpace(task.Title))
            return BadRequest("Title is required");

        return await base.Post(task);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating task");
        return StatusCode(500, "An error occurred while creating the task");
    }
}
```

### Styling (Tailwind CSS)

**Class Organization:**
- Use consistent spacing scale (2, 4, 6, 8, etc.)
- Group related classes logically
- Use responsive prefixes consistently
- Prefer utility classes over custom CSS

```vue
<template>
  <!-- Good -->
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm border">
    <h2 class="text-xl font-semibold text-gray-900">Task List</h2>
    <div class="space-y-3">
      <div v-for="task in tasks" :key="task.id"
           class="flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
        <input type="checkbox" v-model="task.isCompleted" class="rounded">
        <span :class="task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'">
          {{ task.title }}
        </span>
      </div>
    </div>
  </div>
</template>
```

## 🏗️ Project Structure

### Frontend Structure
```
frontend/src/
├── api/                    # API client & types
│   ├── base/              # Axios client & base API class
│   └── types/             # TypeScript interfaces
├── components/            # Reusable components
│   ├── common/           # Shared components
│   └── ui/               # shadcn-vue components
├── views/                 # Page components
├── router/                # Route definitions
├── stores/                # Pinia state management
└── lib/                   # Utilities
```

### Backend Structure
```
backend/Api/
├── Controllers/           # API endpoints
├── Models/               # Entity models
├── Data/                 # Database context & config
│   └── Configurations/   # Entity configurations
├── Extensions/           # Service registrations
└── Program.cs           # Entry point
```

## 🧪 Testing Guidelines

**Unit Tests:**
- Use Vitest for frontend testing
- Test components with `@vue/test-utils`
- Focus on logic, not implementation details
- Mock external dependencies (API calls, stores)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../TaskCard.vue'
import { taskApi } from '@/api/taskApi'

// Mock API
vi.mock('@/api/taskApi')

describe('TaskCard', () => {
  it('displays task title', () => {
    const task = { id: 1, title: 'Test Task', isCompleted: false }
    const wrapper = mount(TaskCard, { props: { task } })

    expect(wrapper.text()).toContain('Test Task')
  })

  it('emits delete event when delete button is clicked', async () => {
    const task = { id: 1, title: 'Test Task', isCompleted: false }
    const wrapper = mount(TaskCard, { props: { task } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([1])
  })
})
```

## 🔧 Development Workflow

### Adding a New Feature

1. **Backend First:**
   - Create entity model inheriting from `BaseEntity`
   - Create entity configuration
   - Add DbSet to `AppDbContext`
   - Create controller inheriting from `BaseController<T>`

2. **Frontend:**
   - Define TypeScript interface in `src/api/types/`
   - Create API client in `src/api/` using `BaseApi`
   - Create Pinia store if needed
   - Create view component
   - Add route in router
   - Update navigation

### Database Changes

**Development:**
- Delete database file (`rm backend/Api/*.db`)
- Restart API server (auto-creates database)

**Production (Future):**
- Use EF Core migrations
- `dotnet ef migrations add MigrationName`
- `dotnet ef database update`

## 🚫 Code Quality Rules

- **No console.log in production code** - use proper logging
- **No any types** - use proper TypeScript typing
- **No empty catch blocks** - handle errors appropriately
- **No direct DOM manipulation** - use Vue's reactivity
- **No hardcoded strings** - use constants or i18n
- **No secrets in code** - use environment variables
- **No unused imports** - clean up imports regularly

## 🛠️ Tooling

- **ESLint:** Code linting and auto-fixing
- **Prettier:** Code formatting (single quotes, no semicolons, 100 char width)
- **TypeScript:** Type checking
- **Vitest:** Unit testing
- **Vue DevTools:** Debug Vue applications
- **Swagger UI:** API documentation and testing

## 📚 Key Dependencies

**Frontend:**
- Vue 3 + TypeScript
- Vite (build tool)
- Vue Router (routing)
- Pinia (state management)
- Axios (HTTP client)
- shadcn-vue + Tailwind CSS (UI)
- Vitest (testing)

**Backend:**
- .NET 9 Web API
- Entity Framework Core
- SQLite (database)
- Swagger/OpenAPI

## 🔄 API Integration Pattern

```typescript
// 1. Define interface
export interface Task extends BaseEntity {
  title: string
  description?: string
  isCompleted: boolean
  dueDate?: string
}

// 2. Create API client
class TaskApi extends BaseApi<Task> {
  constructor() {
    super('task')
  }
}
export const taskApi = new TaskApi()

// 3. Use in component
const tasks = ref<Task[]>([])
const loadTasks = async () => {
  tasks.value = await taskApi.getAll()
}
```

## 🎯 Best Practices

1. **Always run type-check and lint before committing**
2. **Test API endpoints using Swagger UI first**
3. **Use the existing BaseApi/BaseController patterns**
4. **Follow naming conventions consistently**
5. **Keep components small and focused**
6. **Handle errors gracefully**
7. **Write tests for business logic**
8. **Use lazy loading for route components**
9. **Document custom API endpoints**
10. **Keep database schema changes backward compatible**</content>
<parameter name="filePath">AGENTS.md