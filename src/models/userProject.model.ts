import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Project} from './projects.model';
import {User} from './users.model';
import {EUserRole} from '../enums';

@model()
export class ProjectUser extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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

export interface UserProjectRelations { }

export type UserProjectWithRelations = ProjectUser & UserProjectRelations;
