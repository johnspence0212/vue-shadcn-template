<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Effect } from 'effect'
import { taskApi } from '@/api/taskApi'
import type { Task } from '@/api/types/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const tasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const newTitle = ref('')

async function loadTasks() {
  loading.value = true
  error.value = null
  try {
    const result = await Effect.runPromise(taskApi.getAll())
    tasks.value = [...result]
  } catch {
    error.value = 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

async function addTask() {
  const title = newTitle.value.trim()
  if (!title) return
  try {
    const created = await Effect.runPromise(
      taskApi.create({ title, isCompleted: false })
    )
    tasks.value.push(created)
    newTitle.value = ''
  } catch {
    error.value = 'Failed to create task'
  }
}

async function toggleTask(task: Task) {
  const updated = { ...task, isCompleted: !task.isCompleted }
  try {
    await Effect.runPromise(taskApi.update(task.id, updated))
    const index = tasks.value.findIndex((t) => t.id === task.id)
    if (index >= 0) tasks.value[index] = updated
  } catch {
    error.value = 'Failed to update task'
  }
}

async function deleteTask(id: number) {
  try {
    await Effect.runPromise(taskApi.delete(id))
    tasks.value = tasks.value.filter((t) => t.id !== id)
  } catch {
    error.value = 'Failed to delete task'
  }
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4">
    <div>
      <h1 class="text-2xl font-semibold">Tasks</h1>
      <p class="text-sm text-muted-foreground">Sample CRUD wired to the API</p>
    </div>

    <form class="flex gap-2" @submit.prevent="addTask">
      <Input v-model="newTitle" placeholder="New task title" class="max-w-md" />
      <Button type="submit">Add</Button>
    </form>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
    <p v-if="loading" class="text-sm text-muted-foreground">Loading…</p>

    <ul v-else class="space-y-2">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-3 rounded-md border p-3"
      >
        <Checkbox
          :checked="task.isCompleted"
          @update:checked="() => toggleTask(task)"
        />
        <span
          class="flex-1"
          :class="task.isCompleted ? 'text-muted-foreground line-through' : ''"
        >
          {{ task.title }}
        </span>
        <Button variant="ghost" size="sm" @click="deleteTask(task.id)">Delete</Button>
      </li>
      <li v-if="tasks.length === 0" class="text-sm text-muted-foreground">
        No tasks yet. Add one above.
      </li>
    </ul>
  </div>
</template>
