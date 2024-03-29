import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {User,Task} from '../models';
import {UserRepository} from '../repositories';
import { CUser } from './router';

@authenticate('jwt')
export class UserTaskController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get(CUser.USER_TASKS_IN_USER, {
    responses: {
      '200': {
        description: 'Array of User has many Task',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Task)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Task>,
  ): Promise<Task[]> {
    return this.userRepository.tasks(id).find(filter);
  }

  @post(CUser.USER_TASKS_IN_USER, {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Task)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTaskInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) task: Omit<Task, 'id'>,
  ): Promise<Task> {
    return this.userRepository.tasks(id).create(task);
  }

  @patch(CUser.USER_TASKS_IN_USER, {
    responses: {
      '200': {
        description: 'User.Task PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Partial<Task>,
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.userRepository.tasks(id).patch(task, where);
  }

  @del(CUser.USER_TASKS_IN_USER, {
    responses: {
      '200': {
        description: 'User.Task DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Task)) where?: Where<Task>,
  ): Promise<Count> {
    return this.userRepository.tasks(id).delete(where);
  }
}
