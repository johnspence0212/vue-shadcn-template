import { describe, it, expect } from 'vitest'
import { normalizeApiBaseUrl } from '../apiBaseUrl'

describe('normalizeApiBaseUrl', () => {
  it('appends /api when missing', () => {
    expect(normalizeApiBaseUrl('http://localhost:5000')).toBe('http://localhost:5000/api')
  })

  it('keeps single /api suffix', () => {
    expect(normalizeApiBaseUrl('http://localhost:5000/api')).toBe('http://localhost:5000/api')
  })

  it('strips trailing slashes before normalizing', () => {
    expect(normalizeApiBaseUrl('http://localhost:5000/')).toBe('http://localhost:5000/api')
  })
})
