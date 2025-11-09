import type { BaseEntity } from '@/types/base'
import apiClient from './client'

export class BaseApiService<T extends BaseEntity> {
  protected endpoint: string
  protected apiClient = apiClient

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  // GET /api/{endpoint} - Get all entities
  async getAll(): Promise<T[]> {
    const response = await apiClient.get<T[]>(`/${this.endpoint}`)
    return response.data
  }

  // GET /api/{endpoint}/{id} - Get entity by ID
  async getById(id: number): Promise<T> {
    const response = await apiClient.get<T>(`/${this.endpoint}/${id}`)
    return response.data
  }

  // POST /api/{endpoint} - Create new entity
  async create(entity: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    const response = await apiClient.post<T>(`/${this.endpoint}`, entity)
    return response.data
  }

  // PUT /api/{endpoint}/{id} - Update entity
  async update(id: number, entity: T): Promise<void> {
    await apiClient.put(`/${this.endpoint}/${id}`, entity)
  }

  // DELETE /api/{endpoint}/{id} - Delete entity
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/${this.endpoint}/${id}`)
  }
}
