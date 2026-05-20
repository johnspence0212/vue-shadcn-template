/**
 * Resolves the API base URL (must end with `/api` — controllers use `api/[controller]` routes).
 */
export function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw === 'string' && raw.trim() !== '') {
    return normalizeApiBaseUrl(raw.trim())
  }

  // Local `npm run dev` without Aspire: Vite proxies /api → localhost:5000
  if (import.meta.env.DEV) {
    return '/api'
  }

  return 'http://localhost:5000/api'
}

export function normalizeApiBaseUrl(url: string): string {
  const withoutTrailingSlash = url.replace(/\/+$/, '')
  if (withoutTrailingSlash.endsWith('/api')) {
    return withoutTrailingSlash
  }
  return `${withoutTrailingSlash}/api`
}
