import { Schema } from 'effect'

export const BaseEntitySchema = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.optional(Schema.DateFromString)
})

export const TaskSchema = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.optional(Schema.DateFromString),
  title: Schema.String,
  description: Schema.optional(Schema.String),
  isCompleted: Schema.Boolean
})

export type Task = Schema.Schema.Type<typeof TaskSchema>

export const AuthResponseSchema = Schema.Struct({
  accessToken: Schema.String,
  expiresAt: Schema.DateFromString
})

export const UserSchema = Schema.Struct({
  id: Schema.Number,
  email: Schema.String,
  displayName: Schema.optional(Schema.NullOr(Schema.String))
})
