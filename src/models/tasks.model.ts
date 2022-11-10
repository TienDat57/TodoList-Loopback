import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ETaskStatus} from '../enums';
import {Project} from './projects.model';
import {Users} from './users.model';

@model({
  settings: {
    mongodb: {
      collection: 'TaskCollection',
    },
  },
})
export class Tasks extends Entity {
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
    type: 'string',
  })
  createdBy: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'string',
  })
  updatedBy: string;

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

  @belongsTo(() => Project, {name: 'ofProject'})
  projectId: string;

  @belongsTo(() => Users, {name: 'assignedTo'})
  userId: string;

  @belongsTo(() => Tasks, {name: 'linkedTo'})
  linkedTo: string;

  constructor(data?: Partial<Tasks>) {
    super(data);
  }
}

export interface TaskRelations {
}

export type TaskWithRelations = Tasks & TaskRelations;
