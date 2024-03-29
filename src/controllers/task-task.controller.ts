import {authenticate} from '@loopback/authentication';
import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {Task} from '../models';
import {TaskRepository} from '../repositories';
import { CTask } from './router';

@authenticate('jwt')
export class TaskTaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
  ) { }

  @get(CTask.TASK_BELONGS_TO_TASKS, {
    responses: {
      '200': {
        description: 'Task belonging to Task',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Task)},
          },
        },
      },
    },
  })
  async getTask(
    @param.path.string('id') id: typeof Task.prototype.id,
  ): Promise<Task> {
    return this.taskRepository.linkedToTask(id);
  }
}
