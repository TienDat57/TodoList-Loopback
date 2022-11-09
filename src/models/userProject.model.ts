import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Project} from './projects.model';
import {User} from './users.model';

@model()
export class UserProject extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Project)
  projectId: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<UserProject>) {
    super(data);
  }
}

export interface UserProjectRelations {
}

export type UserProjectWithRelations = UserProject & UserProjectRelations;
