import { Schema } from "@effect/schema";

export const BaseEntitySchema = Schema.Struct({
  id: Schema.Number,
  createdAt: Schema.DateFromString
})
