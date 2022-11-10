import {belongsTo, Entity, model, property} from '@loopback/repository';
import {EUserRole} from '../enums';
import {Project} from './projects.model';
import {Users} from './users.model';

@model({
  settings: {
    mongodb: {
      collection: 'ProjectUserCollection',
    },
  },
})
export class ProjectsUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(EUserRole),
    },
  })
  role?: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => Users)
  userId: string;

  constructor(data?: Partial<ProjectsUser>) {
    super(data);
  }
}

export interface UserProjectRelations { }

export type UserProjectWithRelations = ProjectsUser & UserProjectRelations;
