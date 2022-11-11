import {belongsTo, Entity, model, property} from '@loopback/repository';
import {EUserRole} from '../enum';
import {Project} from './project.model';
import {User} from './user.model';

@model()
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

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<ProjectsUser>) {
    super(data);
  }
}

export interface ProjectUserRelations { }

export type UserProjectWithRelations = ProjectsUser & ProjectUserRelations;
