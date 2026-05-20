// frontend/src/api/base/base.ts
import { Effect, Schema } from 'effect'
import { httpClient, ApiError } from './client'
import { ParseError } from '@effect/schema/ParseResult'

export class BaseApiService<T> {
  protected endpoint: string
  protected schema: Schema.Schema<T>
  protected arraySchema: Schema.Schema<readonly T[]>

  constructor(endpoint: string, schema: Schema.Schema<T>) {
    this.endpoint = endpoint
    this.schema = schema
    this.arraySchema = Schema.Array(schema)
  }

  // GET /api/{endpoint} - Get all entities
  getAll(): Effect.Effect<readonly T[], ApiError | ParseError> {
    return httpClient.get<unknown>(`/${this.endpoint}`).pipe(
      Effect.andThen(Schema.decodeUnknown(this.arraySchema))
    )
  }

  // GET /api/{endpoint}/{id} - Get entity by ID
  getById(id: number): Effect.Effect<T, ApiError | ParseError> {
    return httpClient.get<T>(`/${this.endpoint}/${id}`).pipe(
      Effect.andThen(Schema.decodeUnknown(this.schema))
    )
  }

  // POST /api/{endpoint} - Create new entity
  create(entity: Omit<T, 'id' | 'createdAt'>): Effect.Effect<T, ApiError | ParseError> {
    return httpClient.post<T>(`/${this.endpoint}`, entity).pipe(
      Effect.andThen(Schema.decodeUnknown(this.schema))
    )
  }

  // PUT /api/{endpoint}/{id} - Update entity
  update(id: number, entity: T): Effect.Effect<void, ApiError> {
    return httpClient.put(`/${this.endpoint}/${id}`, entity)
  }

  // DELETE /api/{endpoint}/{id} - Delete entity
  delete(id: number): Effect.Effect<void, ApiError> {
    return httpClient.delete(`/${this.endpoint}/${id}`)
  }
}
