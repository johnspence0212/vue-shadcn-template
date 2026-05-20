<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const email = ref('admin@template.local')
const password = ref('AdminPassword123!')
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function onSubmit() {
  await auth.login(email.value.trim(), password.value)
  const redirect = (route.query.redirect as string) || '/'
  await router.push(redirect)
}
</script>

<template>
  <form
    class="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6 shadow-sm"
    @submit.prevent="onSubmit"
  >
    <div class="space-y-1 text-center">
      <h1 class="text-2xl font-semibold">Sign in</h1>
      <p class="text-sm text-muted-foreground">Template full-stack app</p>
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
        autocomplete="current-password"
        required
      />
    </div>
    <p v-if="auth.error" class="text-sm text-destructive">{{ auth.error }}</p>
    <Button type="submit" class="w-full" :disabled="auth.loading">
      {{ auth.loading ? 'Signing in…' : 'Sign in' }}
    </Button>
    <p class="text-center text-sm text-muted-foreground">
      No account?
      <router-link class="text-primary underline" to="/register">Create one</router-link>
    </p>
  </form>
</template>
