# Frontend

Vue 3 + TypeScript application with Vite, Vue Router, Pinia, and shadcn-vue components.

## 🚀 Quick Start

1. **Navigate to the frontend folder:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Access the app:**
   Open `http://localhost:5173` in your browser

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client, schemas & type definitions
│   │   ├── base/
│   │   │   ├── client.ts       # Effect-based HTTP client (no Axios)
│   │   │   └── base.ts         # Base API class with Effect & Schema
│   │   ├── schemas.ts          # Runtime validation schemas
│   │   └── types/
│   │       └── base.ts         # TypeScript interfaces
│   ├── assets/           # CSS and static assets
│   ├── components/       # Reusable components
│   │   ├── common/       # Shared components
│   │   ├── ui/           # shadcn-vue components
│   │   └── AppSidebar.vue
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── router/
│   │   └── index.ts      # Route definitions
│   ├── stores/           # Pinia stores
│   │   └── counter.ts
│   ├── views/            # Page components
│   │   ├── HomeView.vue
│   │   ├── HomeDetailsView.vue
│   │   ├── CalendarView.vue
│   │   ├── InboxView.vue
│   │   ├── SearchView.vue
│   │   └── SettingsView.vue
│   ├── App.vue           # Root component
│   └── main.ts           # App entry point
├── public/               # Static assets
├── components.json       # shadcn-vue config
├── vite.config.ts        # Vite configuration
└── package.json
```

## ⚙️ Configuration

### API Base URL

Edit `src/api/base/client.ts` to configure your API endpoint:

```typescript
// In httpClient object
const BASE_URL = 'http://localhost:5000/api' // Change this to your API URL
```

### Development Server Port

Edit `vite.config.ts` to change the dev server port:

```typescript
export default defineConfig({
  server: {
    port: 5173, // Change port here
  },
})
```

## 🌐 Adding API Integration

### Step 1: Define Schema (Runtime Validation)

Create schemas in `src/api/schemas.ts` for runtime validation:

```typescript
// src/api/schemas.ts
import { Schema } from '@effect/schema'

// Base entity schema
export const BaseEntitySchema = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.DateFromString, // Parses ISO string to Date
  updatedAt: Schema.DateFromString,
})

// Task schema
export const TaskSchema = Schema.Struct({
  ...BaseEntitySchema.fields, // Reuse base fields
  title: Schema.NonEmptyString,
  description: Schema.optional(Schema.String),
  isCompleted: Schema.Boolean,
  dueDate: Schema.optional(Schema.DateFromString),
})

// Derive TypeScript types from schemas (optional)
export type BaseEntity = Schema.Schema.Type<typeof BaseEntitySchema>
export type Task = Schema.Schema.Type<typeof TaskSchema>
```

### Step 2: Create API Client

Create an API client in `src/api/` using the Effect-based `BaseApiService`:

```typescript
// src/api/taskApi.ts
import { BaseApiService } from './base/base'
import { TaskSchema } from './schemas'

export const taskApi = new BaseApiService('tasks', TaskSchema)
```

### Step 3: Use in Components

```vue
<script setup lang="ts">
import { Effect } from 'effect'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/schemas' // Or from interfaces if preferred

const tasks = ref<Task[]>([])
const error = ref<string>('')

const loadTasks = async () => {
  const result = await Effect.runPromise(taskApi.getAll())
  if (Effect.isSuccess(result)) {
    tasks.value = result.success
  } else {
    error.value = result.failure.message // Handles ApiError or ParseError
  }
}

const createTask = async (title: string) => {
  const result = await Effect.runPromise(
    taskApi.create({
      title,
      isCompleted: false,
    })
  )
  if (Effect.isSuccess(result)) {
    tasks.value.push(result.success)
  }
}

onMounted(() => {
  loadTasks()
})
</script>
```

## 🧩 Adding Components

### Reusable Component (common/)

Create components in `src/components/common/`:

```vue
<!-- src/components/common/TaskCard.vue -->
<script setup lang="ts">
import type { Task } from '@/api/types/task'

interface Props {
  task: Task
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>

<template>
  <div class="p-4 border rounded-lg">
    <h3 class="font-semibold">{{ task.title }}</h3>
    <p v-if="task.description" class="text-sm text-gray-600">
      {{ task.description }}
    </p>
    <div class="flex gap-2 mt-2">
      <button @click="emit('toggle', task.id)">
        {{ task.isCompleted ? 'Undo' : 'Complete' }}
      </button>
      <button @click="emit('delete', task.id)">Delete</button>
    </div>
  </div>
</template>
```

### Using shadcn-vue Components

Add new UI components using the CLI:

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add dialog
```

Components are added to `src/components/ui/` and ready to use:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>My Card</CardTitle>
    </CardHeader>
    <CardContent>
      <Button>Click Me</Button>
    </CardContent>
  </Card>
</template>
```

## 📄 Adding Views (Pages)

### Step 1: Create View Component

Create your view in `src/views/`:

```vue
<!-- src/views/TasksView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Effect } from 'effect'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/schemas'
import TaskCard from '@/components/common/TaskCard.vue'

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string>('')

const loadTasks = async () => {
  loading.value = true
  error.value = ''
  const result = await Effect.runPromise(taskApi.getAll())
  if (Effect.isSuccess(result)) {
    tasks.value = result.success
  } else {
    error.value = result.failure.message
  }
  loading.value = false
}

const deleteTask = async (id: number) => {
  const result = await Effect.runPromise(taskApi.delete(id))
  if (Effect.isSuccess(result)) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">My Tasks</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="grid gap-4">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @delete="deleteTask" />
    </div>
  </div>
</template>
```

### Step 2: Add Route

Edit `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TasksView from '@/views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView, // Add your new route
    },
    // Lazy-loaded route
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
```

### Step 3: Add Navigation

Update `src/components/AppSidebar.vue` to include your new route:

```vue
<template>
  <aside class="sidebar">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/tasks">Tasks</RouterLink>
      <RouterLink to="/calendar">Calendar</RouterLink>
    </nav>
  </aside>
</template>
```

## 🗂️ Adding Routes

### Basic Route

```typescript
{
  path: '/tasks',
  name: 'tasks',
  component: TasksView,
}
```

### Route with Parameters

```typescript
{
  path: '/tasks/:id',
  name: 'task-detail',
  component: TaskDetailView,
  props: true,  // Pass route params as props
}
```

### Nested Routes

```typescript
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'dashboard-home',
      component: DashboardHome,
    },
    {
      path: 'settings',
      name: 'dashboard-settings',
      component: DashboardSettings,
    },
  ],
}
```

### Lazy Loading

```typescript
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/views/AdminView.vue'),
}
```

## 🏪 State Management (Pinia)

Create stores in `src/stores/`:

```typescript
// src/stores/taskStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Effect } from 'effect'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/schemas'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  const fetchTasks = async () => {
    loading.value = true
    error.value = ''
    const result = await Effect.runPromise(taskApi.getAll())
    if (Effect.isSuccess(result)) {
      tasks.value = result.success
    } else {
      error.value = result.failure.message
    }
    loading.value = false
  }

  const addTask = async (task: Partial<Task>) => {
    const result = await Effect.runPromise(taskApi.create(task))
    if (Effect.isSuccess(result)) {
      tasks.value.push(result.success)
    }
  }

  const removeTask = async (id: number) => {
    const result = await Effect.runPromise(taskApi.delete(id))
    if (Effect.isSuccess(result)) {
      tasks.value = tasks.value.filter((t) => t.id !== id)
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    removeTask,
  }
})
```

**Use in components:**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<template>
  <div v-if="taskStore.loading">Loading...</div>
  <div v-else-if="taskStore.error">{{ taskStore.error }}</div>
  <div v-else>
    <div v-for="task in taskStore.tasks" :key="task.id">
      {{ task.title }}
    </div>
  </div>
</template>
```

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Effect** - Functional programming & error handling
- **@effect/schema** - Runtime data validation
- **shadcn-vue** - UI components
- **Tailwind CSS** - Utility-first CSS
- **Vitest** - Unit testing

## 🎨 Styling

### Tailwind CSS

Use utility classes directly in templates:

```vue
<template>
  <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold text-gray-900">Hello</h1>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Click me</button>
  </div>
</template>
```

### Component Styles

```vue
<template>
  <div class="my-component">Content</div>
</template>

<style scoped>
.my-component {
  /* Scoped to this component only */
  color: blue;
}
</style>
```

## 📝 Common Tasks

### Change API URL

Edit `src/api/base/client.ts`:

```typescript
const BASE_URL = 'http://localhost:5000/api'
```

### Add New UI Component

```bash
npx shadcn-vue@latest add [component-name]
```

### Run Tests

```bash
npm run test:unit
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## 🚦 Getting Help

- **Dev Server:** `http://localhost:5173`
- **Vue DevTools:** Press `Alt+Shift+D` in the browser
- **Type Errors:** Run `npm run type-check`
- **Lint Errors:** Run `npm run lint`

## 🎯 Best Practices

1. **Type Everything** - Use TypeScript interfaces and Effect schemas for data
2. **Composition API** - Use `<script setup>` for cleaner code
3. **Component Organization** - Keep components small and focused
4. **Lazy Loading** - Use dynamic imports for large routes
5. **Error Handling** - Use Effect for robust error handling and retries
6. **Runtime Validation** - Define schemas for API responses to catch data mismatches
7. **Functional Programming** - Leverage Effect for composable, testable code
8. **Naming Conventions:**
   - Components: `PascalCase` (e.g., `TaskCard.vue`)
   - Views: `PascalCase` + `View` (e.g., `TasksView.vue`)
   - Stores: `camelCase` + `Store` (e.g., `taskStore.ts`)
   - API clients: `camelCase` + `Api` (e.g., `taskApi.ts`)
   - Schemas: `PascalCase` + `Schema` (e.g., `TaskSchema.ts`)

---

**Happy Coding! 🎉**
