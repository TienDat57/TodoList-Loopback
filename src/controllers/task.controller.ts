import {authenticate} from '@loopback/authentication';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, securityId} from '@loopback/security';
import set from 'lodash/set';

import {Task} from '../models';
import {TaskRepository} from '../repositories';
import {MyUserProfile} from '../services/Credentials';
import { ETaskStatus, EUserRole } from '../enums';
import {TaskWithRelations} from './../models/task.model';
import { CTask } from './router';

@authenticate('jwt')
export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
  ) { }

  @post(CTask.TASKS)
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'Task model instance',
    content: {'application/json': {schema: getModelSchemaRef(Task)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTask',
            exclude: ['id'],
          }),
        },
      },
    })
    task: Omit<Task, 'id' | 'isCreatedByAdmin'>,
  ): Promise<Task> {
    const role: EUserRole = currentUserProfile?.role ?? EUserRole.USER;
    const userId: string = currentUserProfile?.id;
    set(task, 'isCreatedByAdmin', role === EUserRole.ADMIN)
    set(task, 'createdBy', userId);
    set(task, 'updatedBy', userId);
    set(task, 'status', ETaskStatus.TODO);
    return this.taskRepository.create(task);
  }

  @get(CTask.COUNT_TASKS)
  @response(200, {
    description: 'Task model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Task) where?: Where<Task>): Promise<Count> {
    return this.taskRepository.count(where);
  }

  @get(CTask.TASKS)
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'Array of Task model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Task, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.filter(Task) filter?: Filter<Task>,
  ): Promise<Task[]> {
    const role: EUserRole = currentUserProfile?.role ?? EUserRole.USER
    const userId: string = currentUserProfile[securityId]
    const tasks: TaskWithRelations[] = await this.taskRepository.find(filter)
    return role === EUserRole.ADMIN
      ? tasks
      : tasks.filter(
          task =>
            !task?.isCreatedByAdmin || String(task?.userId) === userId,
        );
  }

  @patch(CTask.TASKS)
  @response(200, {
    description: 'Task PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'UpdateAllTask',
            exclude: ['id', 'updatedAt', 'updatedBy'],
          }),
        },
      },
    })
    task: Task,
    @param.where(Task) where?: Where<Task>,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    set(task, 'updatedBy', userId);
    set(task, 'updatedAt', new Date());
    await this.taskRepository.updateAll(task, where);
    if (task?.status === ETaskStatus.DONE) {
      setTimeout(() => {
        this.taskRepository.deleteById(task?.id)
      }, 10000); //86400000
    }
  }

  @get(CTask.TASKS_BY_ID)
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'Task model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Task, {includeRelations: true}),
      },
    },
  })
  async findById(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.path.string('id') id: string,
    @param.filter(Task, {exclude: 'where'}) filter?: FilterExcludingWhere<Task>,
  ): Promise<Task> {
    const role: EUserRole = currentUserProfile.role ?? EUserRole.USER;
    const userId: string = currentUserProfile[securityId];
    const task: TaskWithRelations = await this.taskRepository.findById(
      id,
      filter,
    );
    if (role !== EUserRole.ADMIN && task?.isCreatedByAdmin && task?.userId !== userId) {
      throw new HttpErrors.Unauthorized('This task can not be seen by user');
    }
    return task;
  }

  @patch(CTask.TASKS_BY_ID)
  @response(204, {
    description: 'Task PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    set(task, 'updatedBy', userId);
    set(task, 'updatedAt', new Date());
    await this.taskRepository.updateById(id, task);
  }

  @put(CTask.TASKS_BY_ID)
  @response(204, {
    description: 'Task PUT success',
  })
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
    @param.path.string('id') id: string,
    @requestBody() task: Task,
  ): Promise<void> {
    const userId: string = currentUserProfile?.id;
    set(task, 'updatedBy', userId);
    set(task, 'updatedAt', new Date());
    await this.taskRepository.replaceById(id, task);
  }

  @del(CTask.TASKS_BY_ID)
  @response(204, {
    description: 'Task DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.taskRepository.deleteById(id);
  }
}