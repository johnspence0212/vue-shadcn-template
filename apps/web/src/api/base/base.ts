import { Effect, Schema } from 'effect'
import { ParseError } from 'effect/ParseResult'
import { httpClient, ApiError } from './client'

export class BaseApiService<T> {
  protected endpoint: string
  protected schema: Schema.Schema<T, unknown>
  protected arraySchema: Schema.Schema<readonly T[], readonly unknown[]>

  constructor(endpoint: string, schema: Schema.Schema<T, unknown>) {
    this.endpoint = endpoint
    this.schema = schema
    this.arraySchema = Schema.Array(schema)
  }

  getAll(): Effect.Effect<readonly T[], ApiError | ParseError> {
    return httpClient.get<unknown>(`/${this.endpoint}`).pipe(
      Effect.flatMap(Schema.decodeUnknown(this.arraySchema))
    )
  }

  getById(id: number): Effect.Effect<T, ApiError | ParseError> {
    return httpClient.get<unknown>(`/${this.endpoint}/${id}`).pipe(
      Effect.flatMap(Schema.decodeUnknown(this.schema))
    )
  }

  create(
    entity: Record<string, unknown>
  ): Effect.Effect<T, ApiError | ParseError> {
    return httpClient.post<unknown>(`/${this.endpoint}`, entity).pipe(
      Effect.flatMap(Schema.decodeUnknown(this.schema))
    )
  }

  update(id: number, entity: T): Effect.Effect<void, ApiError> {
    return httpClient.put(`/${this.endpoint}/${id}`, entity)
  }

  delete(id: number): Effect.Effect<void, ApiError> {
    return httpClient.delete(`/${this.endpoint}/${id}`)
  }
}
