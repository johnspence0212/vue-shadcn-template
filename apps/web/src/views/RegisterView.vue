<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('')
const password = ref('')
const displayName = ref('')
const auth = useAuthStore()
const router = useRouter()

async function onSubmit() {
  await auth.register(
    email.value.trim(),
    password.value,
    displayName.value.trim() || undefined
  )
  await router.push('/')
}
</script>

<template>
  <form
    class="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6 shadow-sm"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-1 text-center">
      <h1 class="text-2xl font-semibold">Create account</h1>
      <p class="text-sm text-muted-foreground">Register for the template app</p>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-medium" for="displayName">Display name</label>
      <Input id="displayName" v-model="displayName" type="text" autocomplete="name" />
    </div>
    <div class="space-y-2">
      <label class="text-sm font-medium" for="email">Email</label>
      <Input id="email" v-model="email" type="email" autocomplete="email" required />
    </div>
    <div class="space-y-2">
      <label class="text-sm font-medium" for="password">Password</label>
      <Input
        id="password"
        v-model="password"
        type="password"
        autocomplete="new-password"
        required
        minlength="8"
      />
      <p class="text-xs text-muted-foreground">At least 8 characters</p>
    </div>
    <p v-if="auth.error" class="text-sm text-destructive">{{ auth.error }}</p>
    <Button type="submit" class="w-full" :disabled="auth.loading">
      {{ auth.loading ? 'Creating account…' : 'Register' }}
    </Button>
    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <router-link class="text-primary underline" to="/login">Sign in</router-link>
    </p>
  </form>
</template>
