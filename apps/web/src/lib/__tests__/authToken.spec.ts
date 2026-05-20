import { describe, it, expect, beforeEach } from 'vitest'
import { authToken } from '../authToken'

describe('authToken', () => {
  beforeEach(() => {
    authToken.set(null)
  })

  it('stores and clears the bearer token', () => {
    authToken.set('test-token')
    expect(authToken.get()).toBe('test-token')
    authToken.set(null)
    expect(authToken.get()).toBeNull()
  })
})
