import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Project} from './project.model';
import {ETaskStatus} from '../enum';

@model()
export class Task extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isCreatedByAdmin?: boolean;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    default: ETaskStatus.TODO
  })
  status?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted?: boolean;

  @belongsTo(() => User, {name: 'creator'})
  createdBy: string;

  @belongsTo(() => User, {name: 'updater'})
  updatedBy: string;

  @belongsTo(() => Task, {name: 'linked'})
  linkedTo: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User, {name: 'assignee'})
  asignedTo: string;

  constructor(data?: Partial<Task>) {
    super(data);
  }
}

export interface TaskRelations {
  // describe navigational properties here
}

export type TaskWithRelations = Task & TaskRelations;
