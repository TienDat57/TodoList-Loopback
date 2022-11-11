import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProjectsUser} from './projectsUser.model';
import {Tasks} from './tasks.model';

@model({
  settings: {
    mongodb: {
      collection: 'UserCollection',
    },
  },
})
export class Users extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'Date',
  })
  createdAt: Date;

  @property({
    type: 'Date',
  })
  updatedAt: Date;

  @hasMany(() => Tasks)
  tasks: Tasks[];

  @hasMany(() => ProjectsUser)
  userProjects: ProjectsUser[];

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UserRelations {
}

export type UserWithRelations = Users & UserRelations;
