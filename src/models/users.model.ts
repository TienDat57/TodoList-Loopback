import { Entity, hasMany, model, property } from '@loopback/repository';
import { Task } from './tasks.model';
import { ProjectUser } from './userProject.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => ProjectUser)
  userProjects: ProjectUser[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
}

export type UserWithRelations = User & UserRelations;
