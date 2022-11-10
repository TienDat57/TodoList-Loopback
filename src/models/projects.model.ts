import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProjectsUser} from './projectsUser.model';
import {Tasks} from './tasks.model';

@model({
  settings: {
    mongodb: {
      collection: 'ProjectCollection',
    },
  },
})
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

  @hasMany(() => Tasks)
  tasks: Tasks[];

  @hasMany(() => ProjectsUser)
  userProjects: ProjectsUser[];

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
}

export type ProjectWithRelations = Project & ProjectRelations;
