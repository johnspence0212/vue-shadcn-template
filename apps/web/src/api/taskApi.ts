import { Schema } from 'effect'
import { BaseApiService } from './base/base'
import { TaskSchema, type Task } from './types/schema'

class TaskApi extends BaseApiService<Task> {
  constructor() {
    super('task', TaskSchema as Schema.Schema<Task, unknown>)
  }
}

export const taskApi = new TaskApi()
