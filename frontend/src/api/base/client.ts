// frontend/src/api/base/client.ts
import { Effect } from 'effect'

// Custom error type for better error handling
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Base configuration
const BASE_URL = 'http://localhost:5000/api'
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

// Effect-based HTTP client using native fetch (no Axios)
export const httpClient = {
  get: <T>(url: string): Effect.Effect<T, ApiError> =>
    Effect.tryPromise(async () => {
      console.log(`GET ${BASE_URL}${url}`)
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
      })
      if (!response.ok) {
        console.error(`❌ GET ${BASE_URL}${url} - ${response.status}`)
        throw new ApiError(`GET failed: ${response.statusText}`, response.status)
      }
      console.log(`✅ GET ${BASE_URL}${url} - ${response.status}`)
      return response.json()
    }),

  post: <T>(url: string, data: any): Effect.Effect<T, ApiError> =>
    Effect.tryPromise(async () => {
      console.log(`POST ${BASE_URL}${url}`)
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        console.error(`❌ POST ${BASE_URL}${url} - ${response.status}`)
        throw new ApiError(`POST failed: ${response.statusText}`, response.status)
      }
      console.log(`✅ POST ${BASE_URL}${url} - ${response.status}`)
      return response.json()
    }),

  put: (url: string, data: any): Effect.Effect<void, ApiError> =>
    Effect.tryPromise(async () => {
      console.log(`PUT ${BASE_URL}${url}`)
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        console.error(`❌ PUT ${BASE_URL}${url} - ${response.status}`)
        throw new ApiError(`PUT failed: ${response.statusText}`, response.status)
      }
      console.log(`✅ PUT ${BASE_URL}${url} - ${response.status}`)
    }),

  delete: (url: string): Effect.Effect<void, ApiError> =>
    Effect.tryPromise(async () => {
      console.log(`DELETE ${BASE_URL}${url}`)
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS,
      })
      if (!response.ok) {
        console.error(`❌ DELETE ${BASE_URL}${url} - ${response.status}`)
        throw new ApiError(`DELETE failed: ${response.statusText}`, response.status)
      }
      console.log(`✅ DELETE ${BASE_URL}${url} - ${response.status}`)
    }),
}

// Helper to run Effect requests
export const runRequest = <A, E>(effect: Effect.Effect<A, E>) =>
  Effect.runPromise(effect)
