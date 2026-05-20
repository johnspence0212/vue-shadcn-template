import { Effect, Schema } from 'effect'
import { httpClient, runRequest } from './base/client'
import { AuthResponseSchema, UserSchema } from './types/schema'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName?: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    runRequest(
      httpClient.post('/auth/login', data).pipe(
        Effect.flatMap(Schema.decodeUnknown(AuthResponseSchema))
      )
    ),

  register: (data: RegisterRequest) =>
    runRequest(
      httpClient.post('/auth/register', data).pipe(
        Effect.flatMap(Schema.decodeUnknown(AuthResponseSchema))
      )
    ),

  me: () =>
    runRequest(httpClient.get('/auth/me').pipe(Effect.flatMap(Schema.decodeUnknown(UserSchema))))
}
