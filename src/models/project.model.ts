import {Entity, model, property, hasMany} from '@loopback/repository';
import {Task} from './task.model';
import {ProjectUser} from './project-user.model';

@model()
export class Project extends Entity {
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
    type: 'string',
  })
  description?: string;

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

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  projectUsers: ProjectUser[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
