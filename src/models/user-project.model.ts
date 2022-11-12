import {Entity, model, property, belongsTo} from '@loopback/repository';
import { EUserRole } from '../enums';
import {Project} from './project.model';
import {User} from './user.model';

@model()
export class ProjectUser extends Entity {
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

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<ProjectUser>) {
    super(data);
  }
}

export interface UserProjectRelations {
  // describe navigational properties here
}

export type UserProjectWithRelations = ProjectUser & UserProjectRelations;
