import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Project} from './project.model';
import {EUserRole} from '../enum';

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

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Project)
  projectId: string;

  constructor(data?: Partial<ProjectUser>) {
    super(data);
  }
}

export interface ProjectUserRelations {
  // describe navigational properties here
}

export type ProjectUserWithRelations = ProjectUser & ProjectUserRelations;
