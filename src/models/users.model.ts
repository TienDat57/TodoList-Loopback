import {Entity, hasMany, model, property} from '@loopback/repository';
import {ERole} from './../enums/role.enum';
import {Task} from './tasks.model';
import {UserProject} from './userProject.model';

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
  userName: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(ERole),
    },
  })
  role?: ERole;

  @hasMany(() => Task)
  tasks: Task[];

  @hasMany(() => UserProject)
  userProjects: UserProject[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
}

export type UserWithRelations = User & UserRelations;
