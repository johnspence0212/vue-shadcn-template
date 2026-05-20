import { Effect } from 'effect'
import { authToken } from '@/lib/authToken'
import { resolveApiBaseUrl } from '@/lib/apiBaseUrl'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const BASE_URL = resolveApiBaseUrl()

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = authToken.get()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) {
    return response.statusText
  }

  try {
    const json = JSON.parse(text) as {
      title?: string
      detail?: string
      message?: string
    }
    return json.detail ?? json.title ?? json.message ?? text
  } catch {
    return text
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await readErrorMessage(response)
    throw new ApiError(message, response.status)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export const httpClient = {
  get: <T>(url: string): Effect.Effect<T, ApiError> =>
    Effect.tryPromise({
      try: () =>
        fetch(`${BASE_URL}${url}`, {
          method: 'GET',
          headers: authHeaders()
        }).then(handleResponse<T>),
      catch: (error) =>
        error instanceof ApiError ? error : new ApiError(String(error))
    }),

  post: <T, B = unknown>(url: string, data: B): Effect.Effect<T, ApiError> =>
    Effect.tryPromise({
      try: () =>
        fetch(`${BASE_URL}${url}`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(data)
        }).then(handleResponse<T>),
      catch: (error) =>
        error instanceof ApiError ? error : new ApiError(String(error))
    }),

  put: <B = unknown>(url: string, data: B): Effect.Effect<void, ApiError> =>
    Effect.tryPromise({
      try: () =>
        fetch(`${BASE_URL}${url}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(data)
        }).then(handleResponse<void>),
      catch: (error) =>
        error instanceof ApiError ? error : new ApiError(String(error))
    }),

  delete: (url: string): Effect.Effect<void, ApiError> =>
    Effect.tryPromise({
      try: () =>
        fetch(`${BASE_URL}${url}`, {
          method: 'DELETE',
          headers: authHeaders()
        }).then(handleResponse<void>),
      catch: (error) =>
        error instanceof ApiError ? error : new ApiError(String(error))
    })
}

export const runRequest = <A, E>(effect: Effect.Effect<A, E>) => Effect.runPromise(effect)
