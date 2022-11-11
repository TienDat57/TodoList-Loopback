import {inject} from '@loopback/core';
import { UserProfile } from '@loopback/security';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export type Credentials = {
  email: string;
  password: string;
}

export interface MyUserProfile extends UserProfile {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDataSource
  ) {
    super(User, dataSource);
  }
}
