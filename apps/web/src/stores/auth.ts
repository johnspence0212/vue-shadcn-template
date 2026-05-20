import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/authApi'
import { ApiError } from '@/api/base/client'
import { authToken } from '@/lib/authToken'
import type { Schema } from 'effect'
import { UserSchema } from '@/api/types/schema'

type User = Schema.Schema.Type<typeof UserSchema>

const TOKEN_KEY = 'template_auth_token'

function messageFromError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'That email is already registered.'
    }
    if (error.status === 400) {
      return error.message || 'Invalid email or password.'
    }
    if (error.status === 403) {
      return 'Registration is disabled on this server.'
    }
    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error) {
    const msg = error.message
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return 'Cannot reach the API. Check the Aspire dashboard for the correct API URL.'
    }
    if (msg.includes('ParseError') || msg.includes('FiberFailure')) {
      return 'Unexpected response from the server. Try again or sign in if the account was created.'
    }
    if (msg.length > 0 && msg.length < 200) {
      return msg
    }
  }

  return fallback
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  authToken.set(token.value)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(value: string | null) {
    token.value = value
    authToken.set(value)
    if (value) {
      sessionStorage.setItem(TOKEN_KEY, value)
    } else {
      sessionStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login({ email, password })
      setToken(response.accessToken)
      await fetchUser()
    } catch (err) {
      error.value = messageFromError(err, 'Invalid email or password')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, displayName?: string) {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register({ email, password, displayName })
      setToken(response.accessToken)
      try {
        await fetchUser()
      } catch (profileError) {
        // Account exists and token is valid; /me decode or network blips should not block sign-up.
        error.value = messageFromError(
          profileError,
          'Account created, but loading your profile failed. You can continue.'
        )
      }
    } catch (err) {
      error.value = messageFromError(err, 'Registration failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    user.value = await authApi.me()
  }

  async function hydrate() {
    if (token.value) {
      try {
        await fetchUser()
      } catch {
        logout()
      }
    }
  }

  function logout() {
    setToken(null)
    user.value = null
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    fetchUser,
    hydrate,
    logout
  }
})
