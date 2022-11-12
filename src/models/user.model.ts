import {Entity, model, property, hasMany} from '@loopback/repository';
import {Task} from './task.model';
import {ProjectUser} from './user-project.model';

@model()
export class User extends Entity {
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
    default: new Date(),
  })
  createdAt: Date;

  @property({
    type: 'Date',
    default: new Date(),
  })
  updatedAt: Date;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  userProjects: ProjectUser[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
